import { environment } from "../../environments/environment";

export abstract class BaseApiService {
	baseurl: string = environment.apiUrl;
}