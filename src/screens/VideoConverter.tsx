import { invoke } from '@tauri-apps/api/core';
import { useSettings } from '../hooks/useSettings';
import { useEffect, useState } from 'preact/hooks';
import { useVideo } from '../hooks/useVideo';
import { SUPPORTED_VIDEO_FORMATS, SUPPORTED_VIDEO_RESOLUTIONS } from '../types';
import { Link, Repeat } from 'lucide-preact';

export const ScreenVideoConverter = () => {
    const outputPaths = useSettings((state) => state.outputPaths);
    const videoFormat = useVideo((state) => state.videoFormat);
    const videoResolution = useVideo((state) => state.videoResolution);
    const updateVideoFormat = useVideo((state) => state.updateVideoFormat);
    const updateVideoResolution = useVideo((state) => state.updateVideoResolution);
    const convertingVideo = useVideo((state) => state.convertingVideo)
    const convertingVideoUrl = useVideo((state) => state.convertingVideoUrl)
    const setConvertingVideo = useVideo((state) => state.setConvertingVideo)
    const setConvertingVideoUrl = useVideo((state) => state.setConvertingVideoUrl)


    const [videoUrl, setVideoUrl] = useState<string>(convertingVideo ? convertingVideoUrl : '');
    const [videoTitle, setVideoTitle] = useState<string>('');
    const [videoExists, setVideoExists] = useState<boolean>(false);

    // helpers
    function getYoutubeId(url: string): string | null {
        const regex =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regex);
        if (match && match[7].length === 11) {
            return match[7];
        }
        return null;
    }

    function getYoutubeThumbnail(url: string): string | null {
        const id = getYoutubeId(url);
        if (!id) return null;
        return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    async function fetchYoutubeTitle(url: string): Promise<string | null> {
        try {
            const res = await fetch(
                `https://noembed.com/embed?url=${encodeURIComponent(url)}`
            );
            if (!res.ok) return null;
            const data = await res.json();
            return data.title as string;
        } catch {
            return null;
        }
    }

    useEffect(() => {
        if (!videoUrl) {
            setVideoTitle('');
            setVideoExists(false);
            return;
        }

        const id = getYoutubeId(videoUrl);
        if (!id) {
            setVideoTitle('');
            setVideoExists(false);
            return;
        }

        let cancelled = false;

        (async () => {
            const title = await fetchYoutubeTitle(videoUrl);
            if (cancelled) return;
            if (title) {
                setVideoTitle(title);
                setVideoExists(true);
            } else {
                setVideoTitle('');
                setVideoExists(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [videoUrl]);

    const thumbnailUrl = getYoutubeThumbnail(videoUrl);

    // handlers
    const handleChangeUrl = (e: any) => setVideoUrl(e.target.value);
    const handleChangeTitle = (e: any) => setVideoTitle(e.target.value);
    const handleChangeFormat = (e: any) => updateVideoFormat(e.target.value);
    const handleChangeResolution = (e: any) =>
        updateVideoResolution(e.target.value);

    const handleConvert = async () => {
        if (!outputPaths.videoConverter) {
            alert('First, select an output folder for videos.');
            return;
        }
        if (!videoExists) {
            alert('Please enter a valid YouTube video URL.');
            return;
        }

        setConvertingVideo(true);
        setConvertingVideoUrl(videoUrl);

        const safeTitle = (videoTitle || 'video').replace(/[\\/:*?"<>|]/g, '_');
        const destFile = `${outputPaths.videoConverter}\\${safeTitle}.${videoFormat}`;

        try {
            const result = await invoke('convert_video', {
                src: videoUrl,
                destPath: destFile,
                fmt: videoFormat,
                res: videoResolution,
            });
            console.log(result);
        } catch (error: any) {
            console.error('INVOKE ERROR RAW:', error);
            console.error(
                'INVOKE ERROR MESSAGE:',
                error?.message ?? JSON.stringify(error)
            );
        } finally {
            setConvertingVideo(false);
            setConvertingVideoUrl("");
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
                style={{
                    padding: 8,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: '2px solid #444444',
                    backgroundColor: 'rgba(68, 68, 68, 0.6)',
                }}
            >
                <Link size={16} opacity={0.2} />
                <input
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#F7F7F7',
                        fontSize: 14,
                    }}
                    type="text"
                    value={videoUrl}
                    onChange={handleChangeUrl}
                    placeholder="Paste YouTube URL"
                />
            </div>

            {videoExists && thumbnailUrl && (
                <img
                    src={thumbnailUrl}
                    alt="Video thumbnail"
                    style={{
                        width: '100%',
                        maxHeight: '250px',
                        borderRadius: 8,
                        objectFit: 'cover',
                    }}
                />
            )}

            {videoExists && videoTitle && (
                <input
                    style={{
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        color: '#F7F7F7',
                        fontSize: 14,
                    }}
                    type="text"
                    value={videoTitle}
                    onChange={handleChangeTitle}
                />
            )}

            {videoExists && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <select
                            class="custom-select"
                            id="video-format"
                            value={videoFormat}
                            onChange={handleChangeFormat}
                        >
                            {SUPPORTED_VIDEO_FORMATS.map((fmt) => (
                                <option key={fmt} value={fmt}>
                                    {fmt}
                                </option>
                            ))}
                        </select>

                        <select
                            class="custom-select"
                            id="video-resolution"
                            value={videoResolution}
                            onChange={handleChangeResolution}
                            disabled={videoFormat === 'mp3'}
                        >
                            {SUPPORTED_VIDEO_RESOLUTIONS.map((fmt) => (
                                <option key={fmt} value={fmt}>
                                    {`${fmt}p`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                width: '5px',
                                height: '20px',
                                marginRight: '0.5rem',
                                borderRadius: '0.25rem',
                                backgroundColor: '#F59300',
                            }}
                        />
                        <button
                            type="button"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '0.4rem 1.6rem',
                                borderRadius: 4,
                                border: 'none',
                                cursor: 'pointer',
                                backdropFilter: 'blur(4px)',
                                backgroundColor: 'rgba(68, 68, 68, 0.6)',
                            }}
                            onClick={handleConvert}
                            disabled={!videoUrl || convertingVideo || !videoExists}
                            tabIndex={-1}
                        >
                            <Repeat size={18} color="#F7F7F7" />
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 14,
                                    color: '#F7F7F7',
                                }}
                            >
                                {convertingVideo ? 'Converting...' : 'Convert'}
                            </p>
                        </button>

                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                width: '2px',
                                height: '20px',
                                marginRight: '0.5rem',
                                borderRadius: '0.25rem',
                                backgroundColor: '#F59300',
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
