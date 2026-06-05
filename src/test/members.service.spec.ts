import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from '../modules/members/members.service';
import { MembersRepository } from '../modules/members/members.repository';
import { BadRequestException } from '@nestjs/common';
import { MemberDTO } from 'src/modules/members/dto/member.dto';

describe('MembersService', () => {
  let service: MembersService;
  let repository: MembersRepository;

  const mockMember: MemberDTO = {
    id: 'member-uuid',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    subscriptionDate: '2026-01-01',
    phone: '1234567890',
  };

  const mockMembersRepository = {
    create: jest.fn().mockResolvedValue(mockMember),
    findAll: jest.fn().mockResolvedValue([mockMember]),
    findOne: jest.fn().mockResolvedValue(mockMember),
    update: jest.fn().mockResolvedValue(mockMember),
    delete: jest.fn().mockResolvedValue(undefined),
    hasDependents: jest.fn().mockResolvedValue(false),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: MembersRepository,
          useValue: mockMembersRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repository = module.get<MembersRepository>(MembersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a member with no central member', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        subscriptionDate: '2026-01-01',
      };
      const result = await service.create(dto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMember);
    });

    it('should throw BadRequestException if central member is not found', async () => {
      mockMembersRepository.findOne.mockResolvedValueOnce(null);
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        subscriptionDate: '2026-01-01',
        centralMemberId: 'non-existent-uuid',
      };
      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('Central member not found'),
      );
    });

    it('should throw BadRequestException if central member is already a dependent', async () => {
      const parentMember = {
        id: 'parent-uuid',
        centralMemberId: 'grandparent-uuid',
      };
      mockMembersRepository.findOne.mockResolvedValueOnce(parentMember);
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        subscriptionDate: '2026-01-01',
        centralMemberId: 'parent-uuid',
      };
      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('The selected central member is already a dependent of another member'),
      );
    });
  });

  describe('update', () => {
    it('should throw BadRequestException on self-loop link', async () => {
      const dto = {
        centralMemberId: 'member-uuid',
      };
      await expect(service.update('member-uuid', dto)).rejects.toThrow(
        new BadRequestException('A member cannot link to themselves as a central member'),
      );
    });

    it('should throw BadRequestException if a central member with dependents tries to link to someone else', async () => {
      const centralMember = {
        id: 'central-uuid',
      };
      mockMembersRepository.findOne.mockResolvedValueOnce(centralMember);
      mockMembersRepository.hasDependents.mockResolvedValueOnce(true);

      const dto = {
        centralMemberId: 'central-uuid',
      };
      await expect(service.update('member-uuid', dto)).rejects.toThrow(
        new BadRequestException('A central member with dependents cannot be linked to another central member'),
      );
    });
  });
});
