"use client";
import { AudioLines, CirclePause, CirclePlay } from "lucide-react";
import { useRef, useState, useEffect } from "react";


const sections = [
    { title: "Introduction", start: 0 },
    { title: "Chapter 1", start: 40 },
    { title: "Chapter 2", start: 120 },
    { title: "Chapter 3", start: 200 },
];
const audioUrl = "https://maksoodappli.s3.ap-south-1.amazonaws.com/hcp-ishan.mp3";
const highlightAudio = "https://siteglobalpdf.s3.ap-south-1.amazonaws.com/SPEVIGO_Effectiveness_Dosing_and_Safety_Risks.mp3";

export default function AudioWidget() {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [showSections, setShowSections] = useState(false);
    const [sectionIndex, setSectionIndex] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [src, setSrc] = useState(audioUrl);
    const [currentSection, setCurrentSection] = useState("Sections");
    const [isHighlightPlaying, setIsHighlightPlaying] = useState(false);

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

    /* ---------- SECTION NAVIGATION ---------- */
    const getCurrentSectionIndex = () => {
        // Find the current section based on currentTime
        for (let i = sections.length - 1; i >= 0; i--) {
            if (currentTime >= sections[i].start) {
                return i;
            }
        }
        return 0;
    };

    const goToPreviousSection = () => {
        const currentIndex = getCurrentSectionIndex();
        if (currentIndex > 0) {
            const prevSection = sections[currentIndex - 1];
            jumpTo(prevSection.start, prevSection.title);
        } else {
            // If at first section, restart it
            const firstSection = sections[0];
            jumpTo(firstSection.start, firstSection.title);
        }
    };

    const goToNextSection = () => {
        const currentIndex = getCurrentSectionIndex();
        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            jumpTo(nextSection.start, nextSection.title);
        }
    };

    /* ---------- SPEED ---------- */
    const changeSpeed = (r: number) => {
        if (!audioRef.current) return;

        audioRef.current.playbackRate = r;
        setSpeed(r);
    };

    /* ---------- HIGHLIGHT ---------- */
    const playHighlight = () => {
        if (isHighlightPlaying) {
            setIsHighlightPlaying(false);
            setSectionIndex(true);
            setSrc(audioUrl);
            setPlaying(true);
            setTimeout(() => audioRef.current?.play(), 100);
        }
        else {
            setSectionIndex(false);
            setSrc(highlightAudio);
            setTimeout(() => audioRef.current?.play(), 100);
            setPlaying(true);
            setIsHighlightPlaying(true);
        }
    };

    return (
        <div className="w-full h-full z-50">
            <audio ref={audioRef} src={src} />

            {/* Full width responsive layout */}
            <div className="bg-white rounded-lg p-3 space-y-2.5 w-full h-full">


                {/* header */}
                <div className="flex justify-between items-center gap-1" onClick={!playing ? toggle : toggle} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-1.5">
                        {playing ? (
                            <CirclePause className="w-5 h-5 text-green-500" />
                        ) : (
                            <CirclePlay className="w-5 h-5 text-green-500" />
                        )}
                        <span className="font-semibold text-sm">Listen to this page</span>
                    </div>
                    <span className="text-xs text-gray-600">{format(duration)}</span>
                </div>

                {/* Show full player only when playing */}
                {playing && (
                    <>
                        {/* sections */}
                        {sectionIndex && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowSections(!showSections)}
                                    className="border w-full p-2 rounded text-left flex justify-between items-center text-sm gap-2"
                                >
                                    <span className="truncate flex-1 min-w-0">{currentSection}</span>
                                    <span className="shrink-0">▾</span>
                                </button>

                                {showSections && (
                                    <div className="absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-lg max-h-36 overflow-auto z-10">
                                        {sections.map((s) => (
                                            <div
                                                key={s.title}
                                                onClick={() => jumpTo(s.start, s.title)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-start gap-2 text-sm"
                                            >
                                                <span className="truncate flex-1 min-w-0">{s.title}</span>
                                                <span className="text-xs text-gray-500 shrink-0">
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
                        <div className="flex justify-center items-center gap-3">
                            {/* Previous button */}
                            {!isHighlightPlaying && <button
                                onClick={goToPreviousSection}
                                className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>}
                            {/* Play button  */}
                            <button
                                onClick={toggle}
                                className="w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                                {playing ? (
                                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 4H8V16H6V4Z" fill="currentColor" />
                                        <path d="M12 4H14V16H12V4Z" fill="currentColor" />
                                    </svg>
                                ) : (
                                    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 4L15 10L6 16V4Z" fill="currentColor" />
                                    </svg>
                                )}
                            </button>
                            {/* Next button */}
                            {!isHighlightPlaying && <button
                                onClick={goToNextSection}
                                className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>}
                        </div>


                        {/* playback speed and highlights */}
                        <div className="space-y-2">
                            {/* Playback Speed Label */}
                            <span className="text-xs text-gray-700 font-medium block">Playback Speed</span>

                            {/* Controls Row - Highlights + Speed Buttons */}
                            <div className="flex items-center gap-2">
                                {/* Highlights Button */}
                                <button
                                    onClick={playHighlight}
                                    className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors px-2 py-1.5 hover:bg-gray-50 rounded shrink-0"
                                >
                                    <div className={`${isHighlightPlaying ? 'bg-green-500' : 'bg-green-100'} rounded p-1`}>
                                        <AudioLines height={12} width={12} className={isHighlightPlaying ? 'text-white' : 'text-green-600'} />
                                    </div>
                                    <span className="text-xs font-medium">Highlights</span>
                                </button>

                                {/* Speed Controls */}
                                <div className="flex gap-1 flex-1">
                                    {[0.5, 1, 1.5, 2].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => changeSpeed(r)}
                                            className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors rounded ${speed === r
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
                    </>
                )}
            </div>
        </div>
    );
}
