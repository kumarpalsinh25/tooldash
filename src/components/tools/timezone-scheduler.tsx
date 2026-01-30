"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import "moment-timezone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { v4 as uuidv4 } from "uuid";
import {
    Calendar,
    Clock,
    Users,
    Plus,
    Share2,
    Edit3,
    CheckCircle,
} from "lucide-react";
import {
    WhatsappShareButton,
    WhatsappIcon,
    TwitterShareButton,
    TwitterIcon,
    FacebookShareButton,
    FacebookIcon,
    TelegramShareButton,
    TelegramIcon,
    EmailShareButton,
    EmailIcon,
} from "react-share";

interface Availability {
    id: string;
    user: string;
    timezone: string;
    date: string;
    start: string;
    end: string;
}

interface Schedule {
    id: string;
    name: string;
    availabilities: Availability[];
}

export function TimezoneSchedulerTool() {
    const searchParams = useSearchParams();
    const scheduleId = searchParams.get("schedule");

    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [newScheduleName, setNewScheduleName] = useState("");
    const [userName, setUserName] = useState("");
    const [availableTimezones, setAvailableTimezones] = useState<string[]>([]);
    const [addTimezone, setAddTimezone] = useState("");
    const [addDate, setAddDate] = useState(moment().format("YYYY-MM-DD"));
    const [addStart, setAddStart] = useState("09:00");
    const [addEnd, setAddEnd] = useState("17:00");
    const [isEditingName, setIsEditingName] = useState(false);
    const [showShareDropdown, setShowShareDropdown] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Initialize timezones
        const timezones = moment.tz.names();
        setAvailableTimezones(timezones);

        // Load user settings
        const savedName = localStorage.getItem("userName") || "";
        const savedTimezone = localStorage.getItem("defaultTimezone") || Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserName(savedName);
        setAddTimezone(savedTimezone);

        // Handle schedule
        if (scheduleId) {
            let loadedSchedule: Schedule | null = null;
            const localData = localStorage.getItem(`schedule-${scheduleId}`);
            if (localData) {
                loadedSchedule = JSON.parse(localData);
            } else if (window.location.hash.startsWith('#data=')) {
                try {
                    const encoded = window.location.hash.slice(6);
                    const decoded = atob(encoded);
                    loadedSchedule = JSON.parse(decoded);
                } catch (e) {
                    console.error('Failed to load schedule from URL');
                }
            }
            if (loadedSchedule) {
                setSchedule(loadedSchedule);
            }
        } else {
            setNewScheduleName(`Meeting ${moment().format("MMM DD")}`);
        }

        setIsLoaded(true);
    }, [scheduleId]);

    useEffect(() => {
        // Save user settings
        if (userName.trim()) localStorage.setItem("userName", userName.trim());
        if (addTimezone) localStorage.setItem("defaultTimezone", addTimezone);
    }, [userName, addTimezone]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Typography>Loading...</Typography>
            </div>
        );
    }

    const createSchedule = () => {
        const id = uuidv4();
        const newSchedule: Schedule = {
            id,
            name: newScheduleName.trim() || `Meeting ${moment().format("MMM DD")}`,
            availabilities: []
        };
        saveSchedule(newSchedule);
    };

    const saveSchedule = (updatedSchedule: Schedule) => {
        localStorage.setItem(`schedule-${updatedSchedule.id}`, JSON.stringify(updatedSchedule));
        const encoded = btoa(JSON.stringify(updatedSchedule));
        window.history.replaceState(null, "", `?schedule=${updatedSchedule.id}#data=${encoded}`);
        setSchedule(updatedSchedule);
    };

    const addAvailability = () => {
        if (!schedule || !userName.trim() || !addTimezone) return;
        const user = userName.trim();
        // Remove existing availabilities for this user on this date
        const filtered = schedule.availabilities.filter(a => !(a.user === user && a.date === addDate));
        const newAvail: Availability = {
            id: uuidv4(),
            user,
            timezone: addTimezone,
            date: addDate,
            start: addStart,
            end: addEnd,
        };
        const updated = { ...schedule, availabilities: [...filtered, newAvail] };
        saveSchedule(updated);
    };

    const shareLink = () => {
        if (schedule) {
            navigator.clipboard.writeText(`${window.location.origin}/tools/timezone-scheduler?schedule=${schedule.id}${window.location.hash}`);
            setShowShareDropdown(true);
        }
    };

    const updateScheduleName = (name: string) => {
        if (schedule) {
            const updated = { ...schedule, name: name.trim() || schedule.name };
            saveSchedule(updated);
        }
    };

    const findOverlappingHours = (date: string) => {
        if (!schedule) return [];
        const dayAvails = schedule.availabilities.filter(a => a.date === date);
        const users = [...new Set(dayAvails.map(a => a.user))];
        if (users.length < 2) return [];

        // Collect all intervals per user and merge them
        const userMergedIntervals = users.map(user => {
            const userAvails = dayAvails.filter(a => a.user === user);
            const intervals = userAvails.map(a => ({
                start: moment.tz(`${a.date} ${a.start}`, 'YYYY-MM-DD HH:mm', a.timezone),
                end: moment.tz(`${a.date} ${a.end}`, 'YYYY-MM-DD HH:mm', a.timezone),
            })).sort((a, b) => a.start.valueOf() - b.start.valueOf());

            // Merge overlapping intervals for this user
            if (intervals.length === 0) return [];
            let merged = [intervals[0]];
            for (let i = 1; i < intervals.length; i++) {
                const last = merged[merged.length - 1];
                if (last.end.isSameOrAfter(intervals[i].start)) {
                    last.end = moment.max(last.end, intervals[i].end);
                } else {
                    merged.push(intervals[i]);
                }
            }
            return merged;
        });

        // Find common overlapping intervals across all users
        const commonOverlaps: { start: moment.Moment; end: moment.Moment }[] = [];
        const firstUserIntervals = userMergedIntervals[0];
        if (!firstUserIntervals || firstUserIntervals.length === 0) return [];

        for (const interval of firstUserIntervals) {
            let currentStart = interval.start.clone();
            let currentEnd = interval.end.clone();
            let isCommon = true;

            for (let ui = 1; ui < userMergedIntervals.length; ui++) {
                const userIntervals = userMergedIntervals[ui];
                if (!userIntervals || userIntervals.length === 0) {
                    isCommon = false;
                    break;
                }
                let overlapFound = false;
                for (const uiInterval of userIntervals) {
                    const overlapStart = moment.max(currentStart, uiInterval.start);
                    const overlapEnd = moment.min(currentEnd, uiInterval.end);
                    if (overlapStart.isBefore(overlapEnd)) {
                        currentStart = overlapStart;
                        currentEnd = overlapEnd;
                        overlapFound = true;
                        break;
                    }
                }
                if (!overlapFound) {
                    isCommon = false;
                    break;
                }
            }

            if (isCommon && currentStart.isBefore(currentEnd)) {
                commonOverlaps.push({ start: currentStart, end: currentEnd });
            }
        }

        return commonOverlaps;
    };

    if (schedule) {
        const dates = [...new Set(schedule.availabilities.map(a => a.date))].sort();
        const myUser = userName.trim();

        return (
            <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <Typography variant="h1">{schedule.name}</Typography>
                    <Button variant="outline" onClick={shareLink}>Share</Button>
                </div>

                {showShareDropdown && (
                    <Card className="p-4">
                        <Typography variant="h3">Share this schedule</Typography>
                        <div className="mt-2">
                            <Input value={`${window.location.origin}/tools/timezone-scheduler?schedule=${schedule.id}${window.location.hash}`} readOnly />
                        </div>
                        <div className="flex gap-2 mt-2">
                            <WhatsappShareButton url={`${window.location.origin}/tools/timezone-scheduler?schedule=${schedule.id}${window.location.hash}`} title={`Join my meeting: ${schedule.name}`}>
                                <WhatsappIcon size={32} round />
                            </WhatsappShareButton>
                            <TwitterShareButton url={`${window.location.origin}/tools/timezone-scheduler?schedule=${schedule.id}${window.location.hash}`} title={`Join my meeting: ${schedule.name}`}>
                                <TwitterIcon size={32} round />
                            </TwitterShareButton>
                            <FacebookShareButton url={`${window.location.origin}/tools/timezone-scheduler?schedule=${schedule.id}${window.location.hash}`}>
                                <FacebookIcon size={32} round />
                            </FacebookShareButton>
                        </div>
                    </Card>
                )}

                {/* Add Form */}
                <Card className="p-4">
                    <Typography variant="h3">Add Your Availability</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Input placeholder="Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <SearchableSelect
                            options={availableTimezones}
                            value={addTimezone}
                            onChange={setAddTimezone}
                            placeholder="Timezone"
                        />
                        <Input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} />
                        <Input type="time" value={addStart} onChange={(e) => setAddStart(e.target.value)} />
                        <Input type="time" value={addEnd} onChange={(e) => setAddEnd(e.target.value)} />
                        <Button onClick={addAvailability}>Add</Button>
                    </div>
                </Card>

                {/* Availabilities */}
                <div className="space-y-4">
                    {dates.map(date => {
                        const dayAvails = schedule.availabilities.filter(a => a.date === date);
                        const users = [...new Set(dayAvails.map(a => a.user))];
                        const overlaps = findOverlappingHours(date);
                        return (
                            <Card key={date} className="p-4">
                                <Typography variant="h3">{moment(date).format("MMM DD, ddd")}</Typography>
                                <div className="space-y-2 mt-2">
                                    {users.map(user => (
                                        <div key={user} className="flex justify-between">
                                            <span>{user} ({dayAvails.find(a => a.user === user)?.timezone})</span>
                                            <div className="flex gap-1">
                                                {dayAvails.filter(a => a.user === user).map(a => (
                                                    <Badge key={a.id} variant={user === myUser ? "solid" : "soft"}>
                                                        {a.start}-{a.end}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {overlaps.length > 0 && (
                                    <div className="mt-4 p-2 bg-green-50 rounded">
                                        <Typography variant="caption">Common: {overlaps.map(o => `${o.start.format("HH:mm")}-${o.end.format("HH:mm")}`).join(", ")} UTC</Typography>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Typography variant="h1">Create New Schedule</Typography>
            <Card className="p-4 max-w-md">
                <div className="space-y-3">
                    <Input
                        placeholder="Schedule Name (optional)"
                        value={newScheduleName}
                        onChange={(e) => setNewScheduleName(e.target.value)}
                    />
                    <Button onClick={createSchedule} className="w-full">Create Schedule</Button>
                </div>
            </Card>
        </div>
    );
}