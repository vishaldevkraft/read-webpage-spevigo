"use client";
import { Highlights } from "@/public/Highlights";
import { Pause } from "@/public/Pause";
import { Play } from "@/public/Play";
import { PlayerPause } from "@/public/PlayerPause";
import { PlayerPlay } from "@/public/PlayerPlay";
import { AudioLines, CirclePause, CirclePlay } from "lucide-react";
import { useRef, useState, useEffect } from "react";


const sections = [
    { title: "Study Design & Efficacy", start: 0 },      // Chapter 1: 2:18
    { title: "Dosing, Indication, & Contraindications", start: 138 },  // Chapter 2: 3:16
    { title: "Warnings & Precautions", start: 196 },       // Chapter 3: 4:45
    { title: "Adverse Reactions", start: 285 },
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
    const [showPlayerUI, setShowPlayerUI] = useState(false);
    const [showSpeedOptions, setShowSpeedOptions] = useState(false);

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
    // Toggle from header - controls both UI visibility and playback
    const toggleFromHeader = () => {
        if (!audioRef.current) return;

        if (playing) {
            // If playing, pause and hide UI
            audioRef.current.pause();
            setPlaying(false);
            setShowPlayerUI(false);
        } else {
            // If not playing, play and show UI
            if (!showPlayerUI) {
                setShowPlayerUI(true);
                audioRef.current.play();
                setPlaying(true);
            }
            else {
                setShowPlayerUI(false);
            }
        }
    };

    // Toggle from player controls - only controls playback, keeps UI visible
    const togglePlayback = () => {
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
        setShowPlayerUI(true);
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
        setShowSpeedOptions(false);
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
            <div className={`  space-y-2.5 w-full h-full ${showPlayerUI ? 'bg-stone-100 p-3' : 'bg-white p-0'}`}>


                {/* header */}
                <div className={`flex justify-between items-center gap-1 ${!showPlayerUI ? 'bg-stone-100 p-3' : ''}`} onClick={toggleFromHeader} style={{ cursor: 'pointer' }}>
                    <div className="flex items-center gap-1.5">
                        {playing ? (
                            <Pause className="w-5 h-5 text-teal-950" />
                        ) : (
                            <Play className="w-5 h-5" />
                        )}
                        <span className="font-semibold text-sm text-gray-900">Listen to this page</span>
                    </div>
                    <span className="text-xs text-gray-600">{format(duration)}</span>
                </div>

                {/* Show full player only when UI is visible */}
                {showPlayerUI && (
                    <>
                        {/* sections */}
                        {sectionIndex && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowSections(!showSections)}
                                    className="border w-full p-2 rounded text-left flex justify-between items-start gap-2"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-gray-600 mb-1">
                                            Section {getCurrentSectionIndex() + 1} of {sections.length}
                                        </div>
                                        <div className="text-sm font-medium truncate text-gray-900">{currentSection}</div>
                                    </div>
                                    <span className="shrink-0 mt-1">▾</span>
                                </button>

                                {showSections && (
                                    <div className="absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-lg max-h-36 overflow-auto z-10">
                                        {sections.map((s, index) => (
                                            <div
                                                key={s.title}
                                                onClick={() => jumpTo(s.start, s.title)}
                                                className="p-2 hover:bg-gray-100 cursor-pointer text-xs"
                                            >
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="flex-1 min-w-0 break-words text-gray-900">{s.title}</span>
                                                    <span className="text-xs text-gray-500 shrink-0">
                                                        {format(s.start)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* progress */}
                        <div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-green-500 rounded-full transition-all duration-100"
                                    style={{
                                        width: `${(currentTime / (duration || 1)) * 100}%`
                                    }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={seek}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>

                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{format(currentTime)}</span>
                                <span>{Math.round((currentTime / (duration || 1)) * 100)}%</span>
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
                                    <path d="M11 13L5 8L11 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>}
                            {/* Play button  */}
                            <button
                                onClick={togglePlayback}
                                className="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                            >
                                {playing ? (
                                    <PlayerPause height={32} width={32} className="shadow rounded-full" />
                                ) : (
                                    <PlayerPlay height={32} width={32} className="shadow rounded-full" />
                                )}
                            </button>
                            {/* Next button */}
                            {!isHighlightPlaying && <button
                                onClick={goToNextSection}
                                className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors"
                            >
                                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 3L11 8L5 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>}
                        </div>


                        {/* playback speed and highlights */}
                        <div className="space-y-2">
                            {/* Playback Speed Label */}
                            <span className="text-xs text-gray-700 font-medium block">Playback Speed</span>

                            {/* Controls Row - Speed Buttons + Highlights */}
                            <div className="flex items-center gap-2">
                                {/* Speed Controls */}
                                <div className="flex gap-1 flex-1">
                                    {showSpeedOptions ? (
                                        /* Expanded: show all speed options */
                                        [0.5, 1, 1.5, 2].map((r) => (
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
                                        ))
                                    ) : (
                                        /* Collapsed: show only selected speed */
                                        <button
                                            onClick={() => setShowSpeedOptions(true)}
                                            className="px-2 py-1.5 text-xs font-medium rounded bg-green-500 text-white transition-colors"
                                        >
                                            {speed}x
                                        </button>
                                    )}
                                </div>

                                {/* Highlights Button */}
                                <button
                                    onClick={playHighlight}
                                    className="flex items-center gap-1.5 text-sm text-gray-700  transition-colors px-2 py-1.5 rounded shrink-0"
                                >
                                    <div >
                                        <Highlights height={24} width={24} className={`${isHighlightPlaying ? '' : 'bg-stone-100'} cursor-pointer`} />
                                    </div>
                                    <span className="text-xs font-medium">Highlights</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
