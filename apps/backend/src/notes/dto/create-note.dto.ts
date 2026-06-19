export class CreateNoteDto {
    title!: string;
    content!: string;
    isPublic?: boolean;
    tags?: string[];
}
