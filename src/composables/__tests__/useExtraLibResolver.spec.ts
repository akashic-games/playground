import fetchMock from "jest-fetch-mock";
import { useExtraLibsResolver } from "~/composables/useExtraLibsResolver";

describe("useExtraLibsResolver", () => {
	beforeAll(() => {
		fetchMock.enableMocks();
	});

	beforeEach(() => {
		fetchMock.resetMocks();
	});

	test("gets the uri of given module names", () => {
		const extraLibResolver = useExtraLibsResolver();
		expect(extraLibResolver.getExtraLibUris("3.0.0", ["g", "@akashic/trigger"])).toEqual([
			"types/3.0.0/akashic-engine.d.ts",
			"types/3.0.0/trigger.d.ts"
		]);
	});

	test("ignores unknown module names", () => {
		const extraLibResolver = useExtraLibsResolver();
		expect(extraLibResolver.getExtraLibUris("3.0.0", ["unknown", "@akashic/pdi-types"])).toEqual(["types/3.0.0/pdi-types.d.ts"]);
	});

	test("gets type definition file from module names", async () => {
		fetchMock.mockResponse(req => {
			switch (req.url) {
				case "types/3.0.0/akashic-engine.d.ts":
					return Promise.resolve("dummy data (akashic-engine.d.ts)");
				case "types/3.0.0/playlog.d.ts":
					return Promise.resolve("dummy data (playlog.d.ts)");
				default:
					return Promise.reject(new Error("Not Found"));
			}
		});

		const extraLibResolver = useExtraLibsResolver();
		const uris = extraLibResolver.getExtraLibUris("3.0.0", ["g", "@akashic/playlog"]);
		await extraLibResolver.fetchExtraLibsFromUris(uris);

		expect(extraLibResolver.extraLibs).toEqual([
			{
				content: "dummy data (akashic-engine.d.ts)",
				filePath: undefined
			},
			{
				content: "dummy data (playlog.d.ts)",
				filePath: undefined
			}
		]);
	});
});
