// import { readFile } from 'node:fs/promises';
import { ConflictException } from '@utils/errors';

/**
 * Reads an HTML template file from the specified path and replaces placeholders with provided variables.
 * @param {string} path - The path to the HTML template file.
 * @param {AuthorizationEmailVariables} variables - The variables to be replaced in the HTML template.
 * @returns {Promise<string>} A Promise that resolves with the HTML content after replacing placeholders.
 * @throws {ConflictException} Throws a ConflictException if HTML conversion fails.
 */
export const prepareHtmlTemplate = async (htmlString: string, variables: Record<string, string>): Promise<string> => {
  try {
    // let html: string = await readFile(path, 'utf8');
    let html = htmlString;
    for (const key of Object.keys(variables)) {
      html = html.replace(`{{${key}}}`, variables[key]);
    }
    return html;
  } catch (err) {
    throw new ConflictException('Html conversion failed');
  }
};
