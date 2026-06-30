import { describe, expect, it } from "vitest";
import {
	estimateGifExportSizeBytes,
	estimateMp4ExportSizeBytes,
	formatEstimatedFileSize,
	getEstimateLabelForMp4Quality,
} from "./exportSizeEstimate";

describe("export size estimates", () => {
	it("estimates MP4 size from video and audio bitrate", () => {
		expect(
			estimateMp4ExportSizeBytes({
				durationSeconds: 10,
				videoBitrate: 20_000_000,
			}),
		).toBe(25_160_000);
	});

	it("can omit audio from MP4 estimates", () => {
		expect(
			estimateMp4ExportSizeBytes({
				durationSeconds: 10,
				videoBitrate: 20_000_000,
				hasAudio: false,
			}),
		).toBe(25_000_000);
	});

	it("estimates GIF size from dimensions and rendered frame count", () => {
		expect(
			estimateGifExportSizeBytes({
				durationSeconds: 2.1,
				width: 320,
				height: 180,
				frameRate: 15,
			}),
		).toBe(147_456);
	});

	it("formats estimates for the export panel", () => {
		expect(formatEstimatedFileSize(null)).toBe("Calculating");
		expect(formatEstimatedFileSize(980)).toBe("~980 B");
		expect(formatEstimatedFileSize(25_160_000)).toBe("~24 MB");
	});

	it("keeps MP4 quality labels aligned with the export UI", () => {
		expect(getEstimateLabelForMp4Quality("medium")).toBe("low");
		expect(getEstimateLabelForMp4Quality("good")).toBe("medium");
		expect(getEstimateLabelForMp4Quality("source")).toBe("high");
	});
});
