import { StatuspageComponentObject, StatuspageIncidentObject } from '../api';

export function getTitleForStatus(status: StatuspageComponentObject['status']): string {
    switch (status) {
        case 'operational':
            return 'All Systems Operational';
        case 'degraded_performance':
            return 'Degraded Performance';
        case 'partial_outage':
            return 'Partial Outage';
        case 'major_outage':
            return 'Major Outage';
        default:
            return 'Unknown Status';
    }
}

export function getTitleForIncidentStatus(status: StatuspageIncidentObject['status']): string {
    switch (status) {
        case 'investigating':
            return 'Investigating';
        case 'identified':
            return 'Identified';
        case 'monitoring':
            return 'Monitoring';
        case 'resolved':
            return 'Resolved';
        case 'scheduled':
            return 'Scheduled';
        case 'in_progress':
            return 'In progress';
        case 'verifying':
            return 'Verifying';
        case 'completed':
            return 'Completed';
        default:
            return 'Unknown Status';
    }
}

export function getTitleForIncidentImpact(status: StatuspageIncidentObject['impact']): string {
    switch (status) {
        case 'none':
            return '';
        case 'critical':
            return 'Critical outage';
        case 'major':
            return 'Major Outage';
        case 'minor':
            return 'Minor Outage';
        default:
            return 'Unknown Impact';
    }
}
