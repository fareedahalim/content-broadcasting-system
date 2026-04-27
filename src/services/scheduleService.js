function getActiveContent(contents) {

    if (!contents.length) {
        return null;
    }

    let total = 0;

    for (let item of contents) {
        total += Number(item.duration_minutes);
    }

    if (total === 0) {
        return null;
    }

    const start = new Date(contents[0].start_time);
    const now = new Date();

    const elapsedMinutes = Math.floor(
        (now - start) / 60000
    );

    const currentPosition =
        elapsedMinutes % total;

    let running = 0;

    for (let item of contents) {

        running += Number(item.duration_minutes);

        if (currentPosition < running) {
            return item;
        }

    }

    return contents[0];

}

module.exports = { getActiveContent };