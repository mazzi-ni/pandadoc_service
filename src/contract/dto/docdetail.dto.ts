export class DocumentDetailDto {
  docId: string;
  name: string;
  template: string;
  tokens: { name: string, value: string }[];
  fields: object[];
  pricing: object[];

  constructor(payload: any) {
    this.docId = payload.id;
    this.name = payload.name;
    this.template = payload.template;
    this.fields = payload.fields;
    this.pricing = payload.pricing;
    this.tokens = payload.tokens;
  }
}

