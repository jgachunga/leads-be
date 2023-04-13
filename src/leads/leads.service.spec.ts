import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Lead } from '../typeorm/entities/lead.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MatchReason } from '../typeorm/entities/match-reason.entity';

describe('LeadsService', () => {
  let leadsService: LeadsService;
  let leadRepository: Repository<Lead>;

  const mockLeadRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: getRepositoryToken(Lead),
          useValue: mockLeadRepository,
        },
      ],
    }).compile();

    leadsService = moduleRef.get<LeadsService>(LeadsService);
    leadRepository = moduleRef.get<Repository<Lead>>(getRepositoryToken(Lead));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a lead and return the created lead', async () => {
      const createLeadDto = {
        /* test data */
      };
      const mockCreatedLead = { id: 1, ...createLeadDto };
      mockLeadRepository.create.mockReturnValue(mockCreatedLead);
      mockLeadRepository.save.mockResolvedValue(mockCreatedLead);

      const result = await leadsService.create(createLeadDto);

      expect(mockLeadRepository.create).toHaveBeenCalledWith(createLeadDto);
      expect(mockLeadRepository.save).toHaveBeenCalledWith(mockCreatedLead);
      expect(result).toEqual(mockCreatedLead);
    });
  });

  describe('findAll', () => {
    it('should return an array of leads with their match reasons', async () => {
      const mockLeads = [
        { id: 1, matchReasons: [] },
        { id: 2, matchReasons: [] },
      ];
      mockLeadRepository.find.mockResolvedValue(mockLeads);

      const result = await leadsService.findAll();

      expect(mockLeadRepository.find).toHaveBeenCalledWith({
        relations: ['matchReasons'],
      });
      expect(result).toEqual(mockLeads);
    });
  });

  describe('findOne', () => {
    it('should return a lead with its match reasons', async () => {
      const mockLead = { id: 1, matchReasons: [] };
      mockLeadRepository.findOne.mockResolvedValue(mockLead);

      const result = await leadsService.findOne(mockLead.id);

      expect(mockLeadRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockLead.id },
        relations: ['matchReasons'],
      });
      expect(result).toEqual(mockLead);
    });

    it('should throw a NotFoundException if the lead is not found', async () => {
      const mockLeadId = 999;
      mockLeadRepository.findOne.mockResolvedValue(NotFoundException);

      await expect(leadsService.findOne(mockLeadId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLeadRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockLeadId },
        relations: ['matchReasons'],
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated lead', async () => {
      const mockLeadId = 1;
      const updateLeadDto = {
        /* test data */
      };
      const mockUpdatedLead = { id: mockLeadId, ...updateLeadDto };
      mockLeadRepository.preload.mockResolvedValue(mockUpdatedLead);
      mockLeadRepository.save.mockResolvedValue(mockUpdatedLead);

      const result = await leadsService.update(mockLeadId, updateLeadDto);

      expect(mockLeadRepository.preload).toHaveBeenCalledWith({
        id: mockLeadId,
        ...updateLeadDto,
      });
      expect(mockLeadRepository.save).toHaveBeenCalledWith(mockUpdatedLead);
      expect(result).toEqual(mockUpdatedLead);
    });
  });

  describe('remove', () => {
    const leadId = 1;

    it('should throw an error if the lead is not found', async () => {
      mockLeadRepository.findOne.mockResolvedValue(undefined);

      await expect(leadsService.remove(leadId)).rejects.toThrow(
        'Lead with ID 1 not found',
      );
    });

    it('should remove the lead and return it', async () => {
      const lead = new Lead();
      mockLeadRepository.findOne.mockResolvedValue(lead);
      mockLeadRepository.remove.mockResolvedValue(lead);

      const result = await leadsService.remove(leadId);

      expect(result).toEqual(lead);
      const expected = { where: { id: 1 } };
      expect(mockLeadRepository.findOne).toHaveBeenCalledWith(expected);
      expect(mockLeadRepository.remove).toHaveBeenCalledWith(lead);
    });
  });
});
