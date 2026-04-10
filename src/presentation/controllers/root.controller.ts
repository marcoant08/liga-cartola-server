import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class RootController {
  @Get()
  @Redirect('/swagger', 302)
  getRoot(): void {
    // @Redirect envia 302 para a documentação
  }
}
