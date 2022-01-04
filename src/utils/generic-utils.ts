export class Utils {
  public static checkFields(fields: any[], body: any): any {
    let status: number = 200;
    const missingFields: any[] = [];
    for (const name of fields) {
      if (body[name] == null) {
        status = 400;
        missingFields.push(name);
      }
    }
    if (status === 200) {
      return { status };
    }
    const message: string =
      "Missing field" +
      (missingFields.length > 1 ? "s : " : " : ") +
      missingFields.toString();
    return {
      status,
      body: message,
    };
  }
}
