import React, { useEffect, useRef, useState } from 'react';
import { ChartProps } from '../Chart';

const TimelineInput = (props: ChartProps) => {
    const { settings } = props;

    // Settings with defaults
    const minimumYear = settings && settings.minimumYear ? settings.minimumYear : 1200;
    const maximumYear = settings && settings.maximumYear ? settings.maximumYear : 1900;
    const updateDashboardVariableID = settings && settings.updateDashboardVariableID ? settings.updateDashboardVariableID : 'selectedYear';
    const defaultValue = settings && settings.defaultValue ? settings.defaultValue : Math.floor((minimumYear + maximumYear) / 2);
    const title = settings && settings.timelineTitle ? settings.timelineTitle : "Selected Year"

    // Fixed styling values
    const trackHeight = 8;
    const handleSize = 20;
    const trackColor = '#e0e0e0';
    const activeTrackColor = '#1976d2';
    const handleColor = '#1976d2';
    const textColor = '#333';
    const fontSize = 14;

    const [currentValue, setCurrentValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Initialize with existing dashboard parameter value if available
    useEffect(() => {
        if (props.getGlobalParameter) {
            const existingValue = props.getGlobalParameter(updateDashboardVariableID);
            if (existingValue && !isNaN(parseInt(existingValue))) {
                const parsedValue = parseInt(existingValue);
                if (parsedValue >= minimumYear && parsedValue <= maximumYear) {
                    setCurrentValue(parsedValue);
                }
            }
        }
    }, [updateDashboardVariableID, minimumYear, maximumYear, props.getGlobalParameter]);

    // Update dashboard parameter when value changes
    useEffect(() => {
        if (props.setGlobalParameter) {
            props.setGlobalParameter(updateDashboardVariableID, currentValue.toString());
        }
    }, [currentValue, updateDashboardVariableID, props.setGlobalParameter]);

    // Convert year to percentage position
    const yearToPercent = (year: number): number => {
        return ((year - minimumYear) / (maximumYear - minimumYear)) * 100;
    };

    // Convert percentage position to year
    const percentToYear = (percent: number): number => {
        return Math.round(minimumYear + (percent / 100) * (maximumYear - minimumYear));
    };

    // Handle mouse/touch events
    const getEventPosition = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): number => {
        if (!timelineRef.current) return 0;

        const rect = timelineRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const relativeX = clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));

        return percent;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const percent = getEventPosition(e);
        const newYear = percentToYear(percent);
        setCurrentValue(newYear);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const percent = getEventPosition(e);
        const newYear = percentToYear(percent);
        setCurrentValue(newYear);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !timelineRef.current) return;

            const percent = getEventPosition(e);
            const newYear = percentToYear(percent);
            setCurrentValue(newYear);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isDragging || !timelineRef.current) return;
            e.preventDefault();

            const percent = getEventPosition(e);
            const newYear = percentToYear(percent);
            setCurrentValue(newYear);
        };

        const handleTouchEnd = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, minimumYear, maximumYear]);

    // Generate tick marks for major years
    const generateTicks = () => {
        const range = maximumYear - minimumYear;
        const tickCount = Math.min(10, Math.max(3, Math.floor(range / 100)));
        const tickInterval = Math.ceil(range / tickCount / 50) * 50; // Round to nearest 50
        let ticks = [];

        for (let year = minimumYear; year <= maximumYear; year += tickInterval) {
            if (year <= maximumYear) {
                ticks.push(year);
            }
        }
        
        // Remove the last year because it often overlaps with the final year in an ugly way (e.g. 2050/2060)
        ticks = ticks.slice(0, ticks.length-1)

        // Always include the maximum year if it's not already included
        if (ticks[ticks.length - 1] !== maximumYear) {
            ticks.push(maximumYear);
        }
        
        return ticks;
    };

    const ticks = generateTicks();
    const currentPercent = yearToPercent(currentValue);

    const timelineStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 20px',
        fontFamily: "'Nunito Sans', sans-serif",
        userSelect: 'none',
        minHeight: '120px',
    };

    const trackContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        height: `${trackHeight}px`,
        cursor: 'pointer',
    };

    const trackStyle: React.CSSProperties = {
        width: '100%',
        height: `${trackHeight}px`,
        backgroundColor: trackColor,
        borderRadius: `${trackHeight / 2}px`,
        position: 'relative',
    };

    const activeTrackStyle: React.CSSProperties = {
        width: `${currentPercent}%`,
        height: `${trackHeight}px`,
        backgroundColor: activeTrackColor,
        borderRadius: `${trackHeight / 2}px`,
        position: 'absolute',
        top: 0,
        left: 0,
    };

    const handleStyle: React.CSSProperties = {
        position: 'absolute',
        width: `${handleSize}px`,
        height: `${handleSize}px`,
        backgroundColor: handleColor,
        borderRadius: '50%',
        top: `${(trackHeight - handleSize) / 2}px`,
        left: `calc(${currentPercent}% - ${handleSize / 2}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: '2px solid white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        transition: isDragging ? 'none' : 'left 0.1s ease-out',
    };

    const valueDisplayStyle: React.CSSProperties = {
        fontSize: `${fontSize + 4}px`,
        fontWeight: 'bold',
        color: textColor,
        marginBottom: '20px',
        textAlign: 'center',
    };

    const ticksContainerStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        height: '30px',
        marginTop: '10px',
    };

    const tickStyle = (year: number): React.CSSProperties => ({
        position: 'absolute',
        left: `calc(${yearToPercent(year)}% - 10px)`,
        width: '20px',
        textAlign: 'center',
        fontSize: `${fontSize - 2}px`,
        color: textColor,
        opacity: 0.7,
    });

    const majorTickMarkStyle = (year: number): React.CSSProperties => ({
        position: 'absolute',
        left: `${yearToPercent(year)}%`,
        width: '1px',
        height: '8px',
        backgroundColor: textColor,
        opacity: 0.5,
        top: `-${trackHeight + 4}px`,
    });

    return (
        <div style={timelineStyle}>
            <div style={valueDisplayStyle}>
                {title}: {currentValue}
            </div>

            <div
                ref={timelineRef}
                style={trackContainerStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
            >
                <div style={trackStyle}>
                    <div style={activeTrackStyle} />
                    {ticks.map(year => (
                        <div key={year} style={majorTickMarkStyle(year)} />
                    ))}
                </div>
                <div style={handleStyle} />
            </div>

            <div style={ticksContainerStyle}>
                {ticks.map(year => (
                    <div key={year} style={tickStyle(year)}>
                        {year}
                    </div>
                ))}
            </div>

            <div style={{
                fontSize: `${fontSize - 2}px`,
                color: textColor,
                opacity: 0.6,
                marginTop: '10px',
                textAlign: 'center'
            }}>
                Parameter: ${updateDashboardVariableID}
            </div>
        </div>
    );
};

export default TimelineInput;