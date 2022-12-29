import React, { useEffect, useState } from 'react';

export const useDropdownDirection = (ref: React.RefObject<any>, dropdownHeight: number) => {
	const [direction, setDirection] = useState<'down' | 'up'>('down');

	const determineDirection = (ev: any) => {
		const windowHeight = window.innerHeight;
		const elementBottom = ref.current.getBoundingClientRect().bottom;
		if (windowHeight < elementBottom + dropdownHeight) setDirection('up');
		else setDirection('down');
	};

	useEffect(() => {
		window.addEventListener('scroll', determineDirection);
		window.addEventListener('resize', determineDirection);

		return () => {
			window.removeEventListener('scroll', determineDirection);
			window.removeEventListener('resize', determineDirection);
		};
	}, []);

	return { direction, determineDirection };
};
