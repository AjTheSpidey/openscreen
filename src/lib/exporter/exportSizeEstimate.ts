import type { ExportQuality, GifFrameRate } from "./types";

const AUDIO_BITRATE_BPS = 128_000;
const GIF_BYTES_PER_PIXEL_FRAME = 0.08;

export function estimateMp4ExportSizeBytes({
	durationSeconds,
	videoBitrate,
	hasAudio = true,
}: {
	durationSeconds: number;
	videoBitrate: number;
	hasAudio?: boolean;
}) {
	if (durationSeconds <= 0 || videoBitrate <= 0) {
		return null;
	}

	const bitrate = videoBitrate + (hasAudio ? AUDIO_BITRATE_BPS : 0);
	return Math.round((durationSeconds * bitrate) / 8);
}

export function estimateGifExportSizeBytes({
	durationSeconds,
	width,
	height,
	frameRate,
}: {
	durationSeconds: number;
	width: number;
	height: number;
	frameRate: GifFrameRate;
}) {
	if (durationSeconds <= 0 || width <= 0 || height <= 0 || frameRate <= 0) {
		return null;
	}

	const frameCount = Math.ceil(durationSeconds * frameRate);
	return Math.round(width * height * frameCount * GIF_BYTES_PER_PIXEL_FRAME);
}

export function formatEstimatedFileSize(bytes: number | null) {
	if (bytes === null || !Number.isFinite(bytes) || bytes <= 0) {
		return "Calculating";
	}

	const units = ["B", "KB", "MB", "GB"] as const;
	let value = bytes;
	let unitIndex = 0;

	while (value >= 1024 && unitIndex < units.length - 1) {
		value /= 1024;
		unitIndex++;
	}

	const precision = value >= 10 || unitIndex === 0 ? 0 : 1;
	return `~${value.toFixed(precision)} ${units[unitIndex]}`;
}

export function getEstimateLabelForMp4Quality(quality: ExportQuality) {
	if (quality === "medium") return "low";
	if (quality === "good") return "medium";
	return "high";
}
