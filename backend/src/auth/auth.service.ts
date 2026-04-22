import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, pass: string): Promise<any> {
    const admin = await this.prisma.admin.findUnique({
      where: { username },
    });

    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async registerUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
      },
    });
  }

  async login(user: any, role: 'admin' | 'user' = 'admin') {
    const payload = { 
      username: role === 'admin' ? user.username : user.email, 
      sub: user.id,
      role 
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: role === 'admin' ? user.username : user.name,
        email: user.email,
        role,
      },
    };
  }
  async googleLogin(req: any) {
    if (!req.user) {
      return { message: 'No user from google' };
    }

    let user = await this.prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: req.user.email,
          name: req.user.name,
          password: '', // No password for OAuth users
          role: 'user',
        },
      });
    }

    const payload = { 
      email: user.email, 
      sub: user.id, 
      username: user.name,
      role: user.role 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: any) {
    return await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        created_at: true,
      },
    });
  }

  async updateProfile(userId: any, data: any) {
    // Only allow updating certain fields
    const { name, phone, address } = data;
    return await this.prisma.user.update({
      where: { id: Number(userId) },
      data: { name, phone, address },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });
  }
}
