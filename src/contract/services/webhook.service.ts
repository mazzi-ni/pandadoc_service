import { Logger, Injectable } from '@nestjs/common';
import { WebhookDto } from '../dto/webhook.dto';
import { ConfigService } from '@nestjs/config';
import { DocumentDetailDto } from '../dto/docdetail.dto';
import { ContractService } from './contract.service';
import { OfficinaService } from './officina.service';
import { Table } from '../entities/contract.entity';
import { TokenService } from './token.service';
import axios from 'axios';

@Injectable()
export class WeebHookService {
  private readonly logger: Logger = new Logger(WeebHookService.name);
  private DOC_URL: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly contractService: ContractService,
    private readonly officinaService: OfficinaService,
    private readonly tokenService: TokenService,
  ) {
    this.DOC_URL = this.configService.get<string>('pandadoc.doc');
    axios.defaults.headers.common['Authorization'] =
      `API-Key ${this.configService.get<string>('pandadoc.apikey')}`;
  }

  public exec(events: WebhookDto[]) {
    events.map((event) => {
      if (event.data.status === 'document.completed') {
        this.extractData(event.data.id, event.data.name);
      }
    });
  }
  
  // TODO: 
  // - i service sarebbe meglio che fanno i calcoli e ritonarno solo le entity o gli array di entity
  // - poi il push in db potrebbe avvenire qui così tutti i repository stanno qui volendo però boo ???
  // - sistemare token → prendo e poi faccio un bel obj
  // - doppioni

  private async extractData(id: string, name: string) {
    let docDetail: DocumentDetailDto = await this.getDocuments(id);

    let tokens = docDetail.tokens;
    let fields = this.extractFields(docDetail.fields);
    let tables = docDetail.pricing['tables']
      ? (this.extractTables(docDetail.pricing['tables']) as Table[])
      : null;

    const officina =
      fields.merge_fields !== null
        ? await this.officinaService.exec(fields.merge_fields)
        : null;

    const contract =
      tokens !== null && officina !== undefined
        ? await this.tokenService.exec(tokens, name, id, officina)
        : null;
    
    // console.log(contract)
    // return { fields: fields, tables: tables };
  }
  
  private extractTables(tables: object[]) {
    let processTables: object[];

    processTables = tables?.map((tableData) => {
      let table = this.filterObjData(tableData, [
        'id',
        'name',
        'items',
        'columns',
      ]);

      table['columns'] = table['columns']
        .map((column: object) => {
          const obj = this.filterObjData(column, [
            'header',
            'merge_name',
            'hidden',
          ]);
          if (obj['merge_name'] != null && obj['merge_name'].includes('Fee'))
            obj['merge_name'] = obj['merge_name'].replace('Fee', 'value');
          if (obj['hidden'] === false) return obj;
        })
        .filter((item: object) => item !== null && item !== undefined);

      table['items'] = table['items'].map((row: object) => {
        return this.filterObjData(row, [
          'merged_data/Name',
          'merged_data/Description',
          'merged_data/Price',
          'merged_data/Text',
          'merged_data/Text1',
          'merged_data/Text2',
          'merged_data/Fee/value',
          'merged_data/Fee1/value',
          'merged_data/Fee2/value',
          'merged_data/Fee3/value',
        ]);
      });

      table['merge_table'] = this.mergeColAndRow(
        table['columns'],
        table['items'],
      );

      return table;
    });

    return processTables;
  }

  private extractFields(fields: object[]): {
    fields: Object[];
    merge_fields: object;
  } {
    let processFieldData: {
      fields: Object[];
      merge_fields: object;
    };

    processFieldData = { fields: [], merge_fields: {} };
    processFieldData.fields = fields?.map((item) => {
      let field = this.filterObjData(item, [
        'uuid',
        'name',
        'value',
        'field_id',
      ]);

      if (
        !(
          field['name'].includes('Firma') ||
          field['name'].includes('Date') ||
          field['name'].includes('Signature')
        )
      ) {
        processFieldData.merge_fields = {
          ...processFieldData.merge_fields,
          ...this.mergeFields(field),
        };
      }

      return field;
    });

    return processFieldData;
  }

  private mergeFields(field: object) {
    let newField = {};
    newField[field['field_id']] = field['value'];
    return newField;
  }

  private mergeColAndRow(cols: object[], rows: object[]) {
    let table = [];

    rows.map((row) => {
      let table_row = {};
      cols.map((col) => {
        if (row[col['merge_name']]) {
          table_row[col['header']] = row[col['merge_name']];
        }
      });

      table.push(table_row);
    });

    return table;
  }

  private filterObjData(data: object, fields: string[]) {
    let obj = {};
    let count = 1;

    fields.map((field) => {
      let item: any;
      let key = '';

      if (field.includes('/')) {
        let nestedKeys = field.split('/');
        key = nestedKeys[nestedKeys.length - 1];
        item = this.nestedFields(data, nestedKeys);
      } else {
        key = field;
        item = data[field];
      }

      if (obj[key] != undefined) {
        key += count;
        count++;
      }

      obj[key] = item;
    });

    return obj;
  }

  private nestedFields(data: object, fieldsPath: string[]) {
    if (data[fieldsPath[0]] === undefined) {
      return undefined;
    } else if (fieldsPath.length == 1) {
      return data[fieldsPath[0]];
    } else {
      return this.nestedFields(data[fieldsPath[0]], fieldsPath.slice(1));
    }
  }

  private async getDocuments(
    id: string,
  ): Promise<DocumentDetailDto> | undefined {
    try {
      const res = await axios.get(`${this.DOC_URL}/${id}/details`);
      res.data['docId'] = res.data['id'];
      delete res.data['id'];

      return new DocumentDetailDto(res.data);
    } catch (error) {
      this.logger.debug('ERROR: ' + error);
    }
  }
}
