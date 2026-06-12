# Сторонние ассеты и лицензии

Все аудио-ассеты в репозитории — **CC0 1.0 (public domain)**, указание
авторства не требуется, но мы его указываем из уважения.

## Музыка (`music/`) — FreePD, CC0

Источник: freepd.com (зеркало: github.com/SoundSafari/CC0-1.0-Music).

| Файл | Трек | Автор |
|---|---|---|
| ice-and-snow.mp3 | «Ice and Snow» | FreePD (CC0) |
| the-ice-giants.mp3 | «The Ice Giants» | FreePD (CC0) |

## Звуки (`sfx/`) — Kenney, CC0

Файлы перекодированы из Ogg Vorbis в M4A (AAC 96 кбит/с), потому что
iOS Safari не декодирует Vorbis. Содержимое и лицензия не изменились.

Источник: kenney.nl — паки «Sci-Fi Sounds» и «Digital Audio»
(зеркала: github.com/Boyquotes/kenney-sci-fi-sounds-for-godot,
github.com/Boyquotes/kenney-digital-audio-for-godot).

| Группа | Оригиналы |
|---|---|
| turret-* | laser_small_000…003 |
| laser-* | digital laser_4…6 |
| rail-* | laser_large_000…002 |
| shotgun-*, flak-* | explosion_crunch_000…004 |
| vulcan-* | laser_retro_000…002 |
| plasma-* | laser_large_003,004 |
| arc-*, gauss-* | zap_1,2, two_tone, three_tone_down |
| needler-* | phaser_up_1,2 |
| bfg-*, boom-* | low_frequency_explosion_000,001 |
| sing-* | force_field_001,002 |
| hit-* | impact_metal_000…003 |
| trophy-* | digital power_up_4,8 |

Остальные звуки игры (топор, ракеты, диск, крио, кит, комбо, эмбиент)
синтезируются WebAudio на лету. Если удалить папки `sfx/`/`music/` —
игра автоматически вернётся на полный процедурный звук.
