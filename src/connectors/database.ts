/**
 * Database Snapshot & Diff Connector with TOON Compression.
 * Desacoplado do core do ALM Engine.
 */

export interface TableRow {
  [column: string]: any;
}

export class DatabaseConnector {
  /**
   * Converte resultados tabulares de queries SQL para o formato TOON
   * eliminando a repeticao de chaves JSON e bordas pesadas de markdown.
   */
  public static tableToToon(tableName: string, rows: TableRow[]): string {
    if (!rows || rows.length === 0) {
      return `TOON TABLE ${tableName} [0 rows]`;
    }

    const columns = Object.keys(rows[0]);
    const header = columns.join('|');
    const dataRows = rows.map(r => columns.map(c => String(r[c] ?? 'NULL').replace(/\|/g, '/')).join('|'));

    return `TOON TABLE ${tableName} [${rows.length} rows]\n${header}\n${dataRows.join('\n')}`;
  }
}
