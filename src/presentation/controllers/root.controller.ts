import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class RootController {
  @Get()
  getRoot(@Res() res: Response): void {
    res.redirect(302, '/swagger');
  }
}
