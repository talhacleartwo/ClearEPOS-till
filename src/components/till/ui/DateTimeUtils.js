
export function DateTimeToHumanTime(dt)
{
    return new Intl.DateTimeFormat('en-GB', { timeStyle: 'short' }).format(new Date(dt));
}

