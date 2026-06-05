import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from '../modules/members/members.controller';
import { MembersService } from '../modules/members/members.service';
import { CreateMemberDTO } from 'src/modules/members/dto/create-member.dto';
import { UpdateMemberDTO } from 'src/modules/members/dto/update-member.dto';
import { MemberDTO } from 'src/modules/members/dto/member.dto';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const mockMember: MemberDTO = {
    id: 'member-uuid',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'male',
    dateOfBirth: '1990-01-01',
    subscriptionDate: '2026-01-01',
    phone: '1234567890',
  };

  const mockMembersService = {
    create: jest.fn().mockResolvedValue(mockMember),
    findAll: jest.fn().mockResolvedValue([mockMember]),
    findOne: jest.fn().mockResolvedValue(mockMember),
    update: jest.fn().mockResolvedValue(mockMember),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call membersService.create and return created member', async () => {
      const dto: CreateMemberDTO = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        subscriptionDate: '2026-01-01',
        phone: '1234567890',
      };
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockMember);
    });
  });

  describe('findAll', () => {
    it('should call membersService.findAll with parsed page and limit parameters', async () => {
      const result = await controller.findAll('2', '15');
      expect(service.findAll).toHaveBeenCalledWith({ page: 2, limit: 15 });
      expect(result).toEqual([mockMember]);
    });
  });

  describe('findOne', () => {
    it('should call membersService.findOne and return the member', async () => {
      const result = await controller.findOne('member-uuid');
      expect(service.findOne).toHaveBeenCalledWith('member-uuid');
      expect(result).toEqual(mockMember);
    });
  });

  describe('update', () => {
    it('should call membersService.update and return updated member', async () => {
      const dto: UpdateMemberDTO = { firstName: 'Updated' };
      const result = await controller.update('member-uuid', dto);
      expect(service.update).toHaveBeenCalledWith('member-uuid', dto);
      expect(result).toEqual(mockMember);
    });
  });

  describe('delete', () => {
    it('should call membersService.delete', async () => {
      await controller.delete('member-uuid');
      expect(service.delete).toHaveBeenCalledWith('member-uuid');
    });
  });
});
