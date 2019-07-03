import * as xlsx from "xlsx";
import * as dateFormat from "dateformat";
import * as fs from "fs";
import { Singleton } from "typescript-ioc";

function getFilePath(): string {
  const now = new Date();
  const name = dateFormat(now, "dd-mm-yyyy");
  const extension = ".xlsx";
  const folder = "logs/";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  return folder + name + extension;
}

export interface ILogEntry {
  temperature: number;
  cpuLoad: number;
}

const sheetHeader = ["Date", "Température", "Charge CPU"];

function entryToData(entry: ILogEntry): xlsx.CellObject[] {
  return [
    { v: dateFormat("HH:MM"), t: "s" },
    { v: entry.temperature.toFixed(1) + " °C", t: "s" },
    { v: Math.round(entry.cpuLoad) + "%", t: "s" }
  ];
}

@Singleton
export class Logger {
  private workBookCache: xlsx.WorkBook;

  private workBookPath: string = getFilePath();

  constructor() {
    this.workBookCache = this.initializeWorkBook();
  }

  public log(entry: ILogEntry): boolean {
    if (!this.workBook) {
      return false;
    }
    const data = entryToData(entry);
    xlsx.utils.sheet_add_aoa(this.sheet, [data], { origin: -1 });
    xlsx.writeFile(this.workBook, getFilePath());
    return true;
  }

  private initializeWorkBook(): xlsx.WorkBook {
    const path = getFilePath();
    if (!fs.existsSync(path)) {
      return xlsx.utils.book_new();
    }
    return xlsx.readFile(path);
  }

  private get workBook(): xlsx.WorkBook {
    const updatedWorkBookPath = getFilePath();
    // Date changed, need to create a new WorkBook
    if (updatedWorkBookPath !== this.workBookPath) {
      this.workBookPath = updatedWorkBookPath;
      this.workBookCache = xlsx.utils.book_new();
    }
    return this.workBookCache;
  }

  private get sheet(): xlsx.Sheet {
    const sheetName = dateFormat(new Date(), "HH") + "h";
    if (this.workBook.Sheets[sheetName] == null) {
      const newSheet = xlsx.utils.aoa_to_sheet([sheetHeader]);
      xlsx.utils.book_append_sheet(this.workBook, newSheet, sheetName);
    }
    return this.workBook.Sheets[sheetName];
  }
}
