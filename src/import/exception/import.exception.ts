import { NotImplementedException, UnprocessableEntityException} from "@nestjs/common";
import { ImportType } from "../import-type";

export class ImportException {

    public static unsupportedImportTypeException() {
        throw new NotImplementedException("Import type not supported")
    }

    public static invalidCsvException(type: ImportType, line: number) {
        throw new UnprocessableEntityException(`Invalid CSV for import type ${type} on line ${line}`);
    }

    public static importFailedException() {
        throw new UnprocessableEntityException(`Import failed`);
    }
}
