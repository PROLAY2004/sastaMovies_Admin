import apiInterceptor from '../../api/interceptor.js';

export default async function exportActivityLogs(
	navigate,
	toast,
	payload,
	setIsExporting,
) {
	try {
		setIsExporting(true);

		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/admin/export',
			payload, // Forward current search and filter state
		);

		const result = await response.json();

		if (result.success) {
			const logs = result.data;

			if (logs.length === 0) {
				toast.info('No logs found to export.', { theme: 'dark' });
				setIsExporting(false);
				return;
			}

			// 1. Define CSV Headers
			const headers = [
				'Admin Name',
				'Admin Email',
				'Action',
				'Target Entity',
				'Target Details',
				'Date',
				'Time',
			];

			// 2. Map data to CSV rows
			const csvRows = logs.map((log) => {
				const logDate = new Date(log.createdAt);
				const dateFormatted = logDate.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: 'short',
					year: 'numeric',
				});
				const timeFormatted = logDate.toLocaleTimeString('en-US', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: true,
				});

				// Escape quotes and wrap in quotes to handle commas inside text safely
				return [
					`"${(log.adminName || '').replace(/"/g, '""')}"`,
					`"${(log.adminEmail || '').replace(/"/g, '""')}"`,
					`"${(log.action || '').replace(/"/g, '""')}"`,
					`"${(log.targetName || '').replace(/"/g, '""')}"`,
					`"${(log.targetDetails || '').replace(/"/g, '""')}"`,
					`"${dateFormatted}"`,
					`"${timeFormatted}"`,
				].join(',');
			});

			// 3. Combine headers and rows
			const csvContent = [headers.join(','), ...csvRows].join('\n');

			// 4. Create a Blob and trigger download
			const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');

			// Generate filename with current date
			const dateStr = new Date().toISOString().split('T')[0];
			link.setAttribute('href', url);
			link.setAttribute('download', `activity_logs_${dateStr}.csv`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Logs exported successfully!', { theme: 'dark' });
		} else {
			toast.error(result.message, { theme: 'dark' });
		}
	} catch (err) {
		toast.error('Failed to export logs.', { theme: 'dark' });
	} finally {
		setIsExporting(false);
	}
}
