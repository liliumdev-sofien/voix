import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignmentStatus, Style, Prisma } from '@prisma/client';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const speakers = await this.prisma.speaker.findMany({
      include: {
        user: { select: { email: true } }
      }
    });

    const statusCounts = await this.prisma.assignment.groupBy({
        by: ['speakerId', 'status'],
        _count: { status: true }
    });

    return speakers.map(speaker => {
        const counts = statusCounts.filter(s => s.speakerId === speaker.id);
        const assigned = counts.find(s => s.status === AssignmentStatus.ASSIGNED)?._count.status || 0;
        const recorded = counts.find(s => s.status === AssignmentStatus.RECORDED)?._count.status || 0;
        const approved = counts.find(s => s.status === AssignmentStatus.APPROVED)?._count.status || 0;
        const rejected = counts.find(s => s.status === AssignmentStatus.REJECTED)?._count.status || 0;
        
        return {
            id: speaker.id,
            displayName: speaker.displayName,
            email: speaker.user?.email,
            stats: { 
                assigned, 
                recorded, 
                approved, 
                rejected,
                total: assigned + recorded + approved + rejected
            }
        };
    });
  }

  async getAvailableCount(filters: { style?: Style }) {
    const where: Prisma.SentenceWhereInput = {
        assignments: { none: {} }
    };
    
    if (filters.style) {
        // Assuming style is in tags->>'style'
        // Prisma can filter Json
        where.tags = {
            path: ['style'],
            equals: filters.style
        };
    }

    const count = await this.prisma.sentence.count({ where });
    return { count };
  }

  async createAssignments(dto: { speakerId: string, count: number, style?: Style }) {
    const { speakerId, count, style } = dto;
    
    // Find unassigned sentences using raw query for random ordering
    const unassignedIds = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id FROM "Sentence" 
        WHERE NOT EXISTS (SELECT 1 FROM "Assignment" WHERE "sentenceId" = "Sentence".id)
        ${style ? Prisma.sql`AND tags->>'style' = ${style}` : Prisma.empty}
        ORDER BY RANDOM() 
        LIMIT ${count}
    `;

    if (unassignedIds.length === 0) {
        throw new NotFoundException('No available sentences found to assign');
    }

    const operations = unassignedIds.map(row => 
        this.prisma.assignment.create({
            data: {
                speakerId,
                sentenceId: row.id,
                status: AssignmentStatus.ASSIGNED
            }
        })
    );

    // Transaction might be large if count is high, but usually < 100
    await this.prisma.$transaction(operations);
    
    return { count: unassignedIds.length };
  }
}
