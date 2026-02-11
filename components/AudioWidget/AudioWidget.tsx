"use client";
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

        const update = () => setCurrentTime(audio.currentTime);
        const meta = () => setDuration(audio.duration);

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("loadedmetadata", meta);

        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("loadedmetadata", meta);
        };
    }, []);

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
    const jumpTo = (start: number) => {
        if (!audioRef.current) return;

        audioRef.current.currentTime = start;
        audioRef.current.play();
        setPlaying(true);
        setShowSections(false);
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
                        <button onClick={() => setIsOpen(false)}>⏸</button>
                        <span className="font-semibold">Listen to this page</span>
                        <span>{format(duration)}</span>
                    </div>

                    {/* sections */}
                    {sectionIndex && (
                        <div>
                            <button
                                onClick={() => setShowSections(!showSections)}
                                className="border w-full p-2 rounded text-left"
                            >
                                Sections ▾
                            </button>

                            {showSections && (
                                <div className="border rounded mt-2 max-h-40 overflow-auto">
                                    {sections.map((s) => (
                                        <div
                                            key={s.title}
                                            onClick={() => jumpTo(s.start)}
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
                            className="w-full"
                        />

                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{format(currentTime)}</span>
                            <span>{format(duration)}</span>
                        </div>
                    </div>

                    {/* controls */}
                    <div className="flex justify-center gap-6 text-xl">
                        <button onClick={toggle}>{playing ? "⏸" : "▶"}</button>
                    </div>

                    {/* speed */}
                    <div className="flex gap-2">
                        {[0.5, 1, 1.5, 2].map((r) => (
                            <button
                                key={r}
                                onClick={() => changeSpeed(r)}
                                className={`px-3 py-1 rounded ${speed === r ? "bg-green-400" : "bg-gray-200"
                                    }`}
                            >
                                {r}x
                            </button>
                        ))}
                    </div>

                    {/* highlight */}
                    <button
                        onClick={playHighlight}
                        className="bg-green-100 p-2 rounded w-full"
                    >
                        Highlights
                    </button>
                </div>
            )}
        </div>
    );
}
