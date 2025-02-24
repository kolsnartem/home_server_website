<?php
header('Content-Type: application/json');

// Функція для отримання даних про диск
function getDiskUsage($device) {
    $output = shell_exec("df -h $device 2>&1"); // Додаємо 2>&1 для захоплення помилок
    if (empty($output)) {
        return [
            'device' => $device,
            'size' => 'N/A',
            'used' => 'N/A',
            'available' => 'N/A',
            'use_percent' => 'N/A'
        ];
    }
    $lines = explode("\n", trim($output));
    if (count($lines) < 2) {
        return [
            'device' => $device,
            'size' => 'Error',
            'used' => 'Error',
            'available' => 'Error',
            'use_percent' => 'Error'
        ];
    }
    $data = preg_split('/\s+/', $lines[1]);
    
    // Замінюємо назву пристрою
    $customDevice = $data[0];
    if ($customDevice === '/dev/mmcblk0p2') {
        $customDevice = 'LOCAL';
    } else if ($customDevice === '/dev/sda1') {
        $customDevice = 'HDD';
    }

    return [
        'device' => $customDevice,
        'size' => $data[1],
        'used' => $data[2],
        'available' => $data[3],
        'use_percent' => $data[4]
    ];
}

// Отримання даних для обох пристроїв
$disks = [
    'mmcblk0p2' => getDiskUsage('/dev/mmcblk0p2'),
    'sda1' => getDiskUsage('/dev/sda1')
];

// Повернення у форматі JSON
echo json_encode($disks);
?>
