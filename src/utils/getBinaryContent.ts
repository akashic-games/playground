import axios from "axios";

export async function getBinaryContent(url: string): Promise<any> {
	const ret = await axios.get(url, { responseType: "arraybuffer" });
	return ret.data;
}
