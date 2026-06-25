import { Injectable } from "@nestjs/common";
import * as fs from "fs";

@Injectable()
export class FilesService {
    async extractText(filePath: string): Promise<string> {
        const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
        return fileContent;
    }
}