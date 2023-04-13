import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Lead } from '../typeorm/entities/lead.entity';
import { isEmailValid } from 'src/utils/email.util';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  create(createLeadDto: CreateLeadDto) {
    const lead = this.leadRepository.create(createLeadDto);
    return this.leadRepository.save(lead);
  }

  async findAll() {
    const leads = await this.leadRepository.find({
      where: {
        email: Not(IsNull()),
      },
      relations: ['matchReasons'],
    });
    console.log(leads);
    return leads.filter((lead) => isEmailValid(lead.email));
  }

  async findOne(id: number) {
    const lead = await this.leadRepository.findOne({
      relations: ['matchReasons'],
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    console.log(lead);
    return lead;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadRepository.preload({
      id,
      ...updateLeadDto,
    });
    return this.leadRepository.save(lead);
  }

  async remove(id: number): Promise<Lead> {
    const lead = await this.leadRepository.findOne({ where: { id } });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    const deletedLead = await this.leadRepository.remove(lead);
    return deletedLead;
  }
}
