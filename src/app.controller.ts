import { Controller, Get, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";

@Controller()
@ApiTags("redoc")
export class AppController {
  constructor() { }

  @Get('/redoc')
  redocRoute(@Res() res: Response) {
    return res.sendFile(process.cwd() + '/src/redoc/index.html')
  }
}