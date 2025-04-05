import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';


export default function Chart({ eldData }) {

    // const eldData = [
    //     { label: 'Off Duty', start: 0, end: 5 },
    //     { label: 'Sleeper Berth', start: 5, end: 8 },
    //     { label: 'Driving', start: 8, end: 11 },
    //     { label: 'On Duty (not driving)', start: 11, end: 14 },
    //     { label: 'Driving', start: 14, end: 16 },
    //     { label: 'Sleeper Berth', start: 16, end: 18 },
    //     { label: 'Off Duty', start: 18, end: 24 },
    // ];

    const activityLabels = ['Off Duty', 'Sleeper Berth', 'Driving', 'On Duty (not driving)'];
    const activityMap = {
        'Off Duty': 1,
        'Sleeper Berth': 2,
        'Driving': 3,
        'On Duty (not driving)': 4,
    };

    const labels = [];
    const activities = [];
    const totalTimes = { 'Off Duty': 0, 'Sleeper Berth': 0, 'Driving': 0, 'On Duty (not driving)': 0 };

    eldData.forEach(({ label, start, end }) => {
        labels.push(start, end);
        activities.push(activityMap[label], activityMap[label]);
        totalTimes[label] += end - start;
    });

    const totalHrs = Object.values(totalTimes).reduce((a, b) => a + b, 0)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <Box mt={3}>
            <Typography variant="subtitle2" textAlign="center" textTransform={'uppercase'} mb={2} >
                driver's daily log
            </Typography>
            <LineChart
                slotProps={{ legend: { hidden: true } }}
                topAxis={[{ data: labels }]}
                axisHighlight={{
                    x: 'none',
                    y: 'none',
                }}
                xAxis={[{
                    data: labels,
                    // label: 'Time (Hours)', 
                    valueFormatter: (value) => (value == 0 || value == 24 ? "m'night" : value == 12 ? 'noon' : `${value}`),
                    tickMaxStep: 2,
                }]}
                yAxis={[{
                    data: [0, 1, 2, 3, 4, 5],
                    scaleType: 'point',
                    valueFormatter: (value) => (value > 0 && value < 5 ? activityLabels[value - 1] : ''),
                }]}
                rightAxis={{
                    data: [0, 1, 2, 3, 4, 5],
                    scaleType: 'point',
                    valueFormatter: (value) => (value > 0 && value < 5 ? `${totalTimes[activityLabels[value - 1]]} hrs` : value == 5 ? `=${totalHrs} hrs` : ''),
                }}
                series={[{
                    data: activities,
                    // label: 'Activity',
                    showMark: false,
                    curve: 'step',
                }]}
                grid={{ horizontal: true, vertical: true }}
                width={640}
                height={300}
                margin={{
                    left: 150,
                    right: 80,
                    top: 0,
                    bottom: 80,
                }}
                loading={false}
            />
            <Box px={5}>
                <Typography variant="h6">Remarks</Typography>
                {eldData.some((data) => data.remarks) ? (
                    eldData.map((data, index) =>
                        data.remarks ? (
                            <Typography key={index} variant="body1">
                                {`${data.start} - ${data.end} → ${data.remarks}`}
                            </Typography>
                        ) : null
                    )
                ) : (
                    <Typography variant="body1">None</Typography>
                )}
            </Box>

        </Box>
    );
}
