
// Get date
const getToday = () => {
	return new Date();
};

const isLeap = (year) => {
	return (year % 100 === 0) ? ( (year % 400) === 0 ? 1 : 0 ) : ( (year % 4 === 0) === 0 ? 1 : 0 );
};

const daysPerMonth = (date) => {
	date = date || getToday();
	return [31, 28 + isLeap( date.getFullYear() ), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

const getMonthDays = (date) => {
	date = date || getToday();
	return daysPerMonth()[ date.getMonth() ];
};

const getFirstDay = (date) => {
	date = date || getToday();
	return new Date( date.getFullYear(), date.getMonth(), 1 ).getDay();
};

const getColumnNum = (date) => {
	date = date || getToday();
	return Math.ceil( ( getMonthDays(date) + getFirstDay(date) ) / 7 );
};

// Set date
const setPreviousMonth = (date) => {
	date.setMonth(date.getMonth() - 1, 1);
	return date;
}

const setNextMonth = (date) => {
	date.setMonth(date.getMonth() + 1, 1);
	return date;
}

// Compare today
const compareToday = (day, date) => {
	const today = getToday();
	const year = date.getFullYear();
	const month = date.getMonth();

	if ( year === today.getFullYear() && month === today.getMonth() && day === today.getDate() ) {
		return true;
	}

	return false;
}

const checkWithinDate = (currentDate, startDate, endDate) => {
	if ( currentDate >= startDate && currentDate <= endDate ) {
		return true;
	}
	return false;
}


// Interface
const calculator = {
	today: () => {
		return getToday();
	},
	monthDays: (date) => {
		return getMonthDays(date);
	},
	firstDay: (date) => {
		return getFirstDay(date);
	},
	column: (date) => {
		return getColumnNum(date);
	},
	previousMonth: (date) => {
		return setPreviousMonth(date);
	},
	nextMonth: (date) => {
		return setNextMonth(date);
	},
	isToday: (day, date) => {
		return compareToday(day, date);
	},
	withinDate: (currentDate, startDate, endDate) => {
		return checkWithinDate(currentDate, startDate, endDate);
	},
};

export default calculator;