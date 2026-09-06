/**
 * IBM RTC / CCM (OSLC) & Redmine Domain Connector.
 * Desacoplado do core do ALM Engine.
 */

export interface CcmWorkItem {
  id: string;
  title: string;
  type: string;
  status: string;
  owner?: string;
  severity?: string;
  description?: string;
  commentsCount?: number;
}

export class CcmConnector {
  /**
   * Converte uma lista de itens de trabalho para o formato tabular TOON (Token-Oriented Object Notation)
   * economizando de 40% a 60% de tokens no prompt do modelo.
   */
  public static toToonFormat(items: CcmWorkItem[]): string {
    if (!items || items.length === 0) return '[]';

    const header = ['id', 'type', 'status', 'severity', 'title'].join('|');
    const rows = items.map(item => {
      const cleanTitle = (item.title || '').replace(/\|/g, '/');
      return [item.id, item.type, item.status, item.severity || 'Normal', cleanTitle].join('|');
    });

    return `TOON[${items.length}]\n${header}\n${rows.join('\n')}`;
  }
}
