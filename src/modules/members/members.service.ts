import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MembersRepository } from 'src/modules/members/members.repository';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) { }

  /**
   * This method creates a new member
   * @param member - The member to create
   * @returns The created member
   */
  async create(member: CreateMemberDTO): Promise<MemberDTO> {
    if (member.centralMemberId) {
      await this.validateFamilyLink(null, member.centralMemberId);
    }
    return this.repository.create(member);
  }

  /**
   * This method finds all members
   * FIXME: A club can have more than 100k members, wow!
   * Can we find a way to return the members in an efficient way?
   */
  async findAll(query?: { page?: number; limit?: number }): Promise<MemberDTO[]> {
    const page = query?.page ? Number(query.page) : 1;
    const limit = query?.limit ? Number(query.limit) : 10;
    const offset = (page - 1) * limit;

    return this.repository.findAll(limit, offset);
  }

  async findOne(id: string): Promise<MemberDTO> {
    return this.repository.findOne(id);
  }

  async update(id: string, member: UpdateMemberDTO): Promise<MemberDTO> {
    if (member.centralMemberId !== undefined) {
      await this.validateFamilyLink(id, member.centralMemberId);
    }
    return this.repository.update(id, member);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async validateFamilyLink(memberId: string | null, centralMemberId: string | null | undefined): Promise<void> {
    if (!centralMemberId) return;

    // 1. Check self-loop
    if (memberId && memberId === centralMemberId) {
      throw new BadRequestException('A member cannot link to themselves as a central member');
    }

    // 2. Check existence of the central member
    const centralMember = await this.repository.findOne(centralMemberId);
    if (!centralMember) {
      throw new BadRequestException('Central member not found');
    }

    // 3. Prevent multi-level hierarchy: a central member cannot be a dependent of someone else
    if (centralMember.centralMemberId) {
      throw new BadRequestException('The selected central member is already a dependent of another member');
    }

    // 4. Prevent circular/reverse links: if this member is currently a central member for others, they cannot become a dependent of someone else
    if (memberId) {
      const isCentral = await this.repository.hasDependents(memberId);
      if (isCentral) {
        throw new BadRequestException('A central member with dependents cannot be linked to another central member');
      }
    }
  }
}
