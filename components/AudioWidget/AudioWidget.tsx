"use client";
import { AudioLines, CirclePause } from "lucide-react";
import { useRef, useState, useEffect } from "react";


const sections = [
    { title: "Introduction", start: 0 },
    { title: "Chapter 1", start: 40 },
    { title: "Chapter 2", start: 120 },
    { title: "Chapter 3", start: 200 },
];
const audioUrl = "https://maksoodappli.s3.ap-south-1.amazonaws.com/hcp-ishan.mp3";
const highlightAudio = "https://objectstore.e2enetworks.net/voiceai/livekit/session-697b400cfa08ff65b077c099-aa768e61-32eb-482d-81b2-cd52ae3a88c3.ogg";

export default function AudioWidget() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showSections, setShowSections] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [src, setSrc] = useState(audioUrl);
    const [currentSection, setCurrentSection] = useState("Sections");

    /* ---------- FORMAT TIME ---------- */
    const format = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    /* ---------- AUDIO EVENTS ---------- */
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const update = () => {
            console.log('update')
            setCurrentTime(audio.currentTime);
        }
        const meta = () => {
            console.log('meta')
            setDuration(audio.duration);
        }

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("loadedmetadata", meta);

        if (audio.readyState >= 1) { // HAVE_METADATA or greater
            console.log('Metadata already loaded, setting duration:', audio.duration);
            setDuration(audio.duration);
        }

        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("loadedmetadata", meta);
        };
    }, [src]);

    /* ---------- PLAY PAUSE ---------- */
    const toggle = () => {
        if (!audioRef.current) return;

        if (playing) audioRef.current.pause();
        else audioRef.current.play();

        setPlaying(!playing);
    };

    /* ---------- SEEK BAR ---------- */
    const seek = (e: any) => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = e.target.value;
        setCurrentTime(e.target.value);
    };

    /* ---------- SECTION JUMP ---------- */
    const jumpTo = (start: number, title: string) => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = start;
        audioRef.current.play();
        setPlaying(true);
        setShowSections(false);
        setCurrentSection(title);
    };

    /* ---------- SPEED ---------- */
    const changeSpeed = (r: number) => {
        if (!audioRef.current) return;

        audioRef.current.playbackRate = r;
        setSpeed(r);
    };

    /* ---------- HIGHLIGHT ---------- */
    const playHighlight = () => {
        setSectionIndex(false);
        setSrc(highlightAudio);
        setTimeout(() => audioRef.current?.play(), 100);
        setPlaying(true);
    };

    return (
        <div className="fixed bottom-6 right-6 w-80 z-50">
            <audio ref={audioRef} src={src} />

            {/* collapsed */}
            {!isOpen && (
                <div
                    onClick={() => setIsOpen(true)}
                    className="bg-white shadow-lg rounded-xl p-3 flex justify-between cursor-pointer"
                >
                    ▶ Listen to this page
                </div>
            )}

            {/* expanded */}
            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl p-4 space-y-4">

                    {/* header */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsOpen(false)}>
                                <CirclePause height={18} width={18} />
                            </button>
                            <span className="font-semibold">Listen to this page</span>
                        </div>
                        <span>{format(duration)}</span>
                    </div>

                    {/* sections */}
                    {sectionIndex && (
                        <div className="relative">
                            <button
                                onClick={() => setShowSections(!showSections)}
                                className="border w-full p-2 rounded text-left flex justify-between items-center"
                            >
                                <span>{currentSection}</span>
                                <span>▾</span>
                            </button>

                            {showSections && (
                                <div className="absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-lg max-h-40 overflow-auto z-10">
                                    {sections.map((s) => (
                                        <div
                                            key={s.title}
                                            onClick={() => jumpTo(s.start, s.title)}
                                            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                        >
                                            {s.title}
                                            <span className="text-xs text-gray-500">
                                                {format(s.start)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    {/* progress */}
                    <div>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            value={currentTime}
                            onChange={seek}
                            // className="w-full"
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                            style={{
                                background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${(currentTime / (duration || 1)) * 100}%, rgb(229 231 235) ${(currentTime / (duration || 1)) * 100}%, rgb(229 231 235) 100%)`
                            }}
                        />

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{format(currentTime)}</span>
                            <span>{format(duration)}</span>
                        </div>
                    </div>

                    {/* controls */}
                    <div className="flex justify-center items-center gap-4">
                        {/* Previous button */}
                        <button
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.max(0, currentTime - 10);
                                }
                            }}
                            className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {/* Play button  */}
                        <button
                            onClick={toggle}
                            className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            {playing ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 4H8V16H6V4Z" fill="currentColor" />
                                    <path d="M12 4H14V16H12V4Z" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 4L15 10L6 16V4Z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                        {/* Next button */}
                        <button
                            onClick={() => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
                                }
                            }}
                            className="w-10 h-10 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>


                    {/* playback speed and highlights */}
                    <div className="space-y-3">
                        {/* Playback Speed */}
                        <span className="text-sm text-gray-700 font-medium mb-2 block">Playback Speed</span>
                        <div className="flex items-center justify-between">
                            {/* Highlights */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={playHighlight}
                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    <AudioLines height={16} width={16} />
                                    <span className="text-xs">Highlights</span>
                                </button>
                            </div>
                            <div className="flex ">
                                {[0.5, 1, 1.5, 2].map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => changeSpeed(r)}
                                        className={`px-2.5 py-1 text-xs font-medium transition-colors ${speed === r
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                            }`}
                                    >
                                        {r}x
                                    </button>
                                ))}
                            </div>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}
