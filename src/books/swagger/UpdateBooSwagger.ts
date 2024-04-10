import { PartialType } from "@nestjs/swagger";
import { CreateBookDto } from "../dto/create-book.dto";

export class UpdateBookSwagger extends PartialType(CreateBookDto) { }