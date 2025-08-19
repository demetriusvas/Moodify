/*
  Explicação do JavaScript:
  Este arquivo controla a interatividade do aplicativo Playlist de Humor.
  Ele gerencia a troca de tema (claro/escuro), a seleção de humor, a geração dinâmica de playlists (simulada),
  e as animações da interface. As funções são nomeadas e organizadas para clareza.
*/

// Espera o DOM carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeLabel = document.querySelector('label[for="theme-switcher"]');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const playlistSection = document.getElementById('playlist-section');
    const playlistOutput = document.getElementById('playlist-output');
    const moodTitle = document.getElementById('mood-title');
    const body = document.body;

    // --- Banco de Músicas (Simulado) ---
    const musicDB = {
        happy: [
            { title: 'Happy', artist: 'Pharrell Williams' },
            { title: 'Don\'t Stop Me Now', artist: 'Queen' },
            { title: 'Walking on Sunshine', artist: 'Katrina & The Waves' },
            { title: 'Good Vibrations', artist: 'The Beach Boys' },
            { title: 'Lovely Day', artist: 'Bill Withers' },
            { title: 'Here Comes the Sun', artist: 'The Beatles' },
            { title: 'I Want You Back', artist: 'The Jackson 5' },
            { title: 'September', artist: 'Earth, Wind & Fire' },
            { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
            { title: 'Can\'t Stop The Feeling!', artist: 'Justin Timberlake' },
            { title: 'Shake It Off', artist: 'Taylor Swift' },
            { title: 'Ain\'t No Mountain High Enough', artist: 'Marvin Gaye & Tammi Terrell' },
            { title: 'Three Little Birds', artist: 'Bob Marley & The Wailers' },
            { title: 'Celebration', artist: 'Kool & The Gang' },
            { title: 'Dancing Queen', artist: 'ABBA' },
        ],
        sad: [
            { title: 'Someone Like You', artist: 'Adele' },
            { title: 'Hallelujah', artist: 'Leonard Cohen' },
            { title: 'Fix You', artist: 'Coldplay' },
            { title: 'Everybody Hurts', artist: 'R.E.M.' },
            { title: 'Tears in Heaven', artist: 'Eric Clapton' },
            { title: 'Yesterday', artist: 'The Beatles' },
            { title: 'Nothing Compares 2 U', artist: 'Sinead O\'Connor' },
            { title: 'My Heart Will Go On', artist: 'Celine Dion' },
            { title: 'Mad World', artist: 'Tears for Fears' },
            { title: 'Creep', artist: 'Radiohead' },
            { title: 'The Sound of Silence', artist: 'Simon & Garfunkel' },
            { title: 'Gloomy Sunday', artist: 'Billie Holiday' },
            { title: 'Hurt', artist: 'Johnny Cash' },
            { title: 'Candle in the Wind', artist: 'Elton John' },
            { title: 'Wish You Were Here', artist: 'Pink Floyd' },
        ],
        energetic: [
            { title: 'Thunderstruck', artist: 'AC/DC' },
            { title: 'Eye of the Tiger', artist: 'Survivor' },
            { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
            { title: 'Bohemian Rhapsody', artist: 'Queen' },
            { title: 'Livin\' on a Prayer', artist: 'Bon Jovi' },
            { title: 'Sweet Child o\' Mine', artist: 'Guns N\' Roses' },
            { title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
            { title: 'Seven Nation Army', artist: 'The White Stripes' },
            { title: 'Mr. Brightside', artist: 'The Killers' },
            { title: 'Lose Yourself', artist: 'Eminem' },
            { title: 'Crazy in Love', artist: 'Beyoncé ft. Jay-Z' },
            { title: 'Blinding Lights', artist: 'The Weeknd' },
            { title: 'Bad Romance', artist: 'Lady Gaga' },
            { title: 'Pump Up The Jam', artist: 'Technotronic' },
            { title: 'Gonna Make You Sweat (Everybody Dance Now)', artist: 'C+C Music Factory' },
        ],
        calm: [
            { title: 'Weightless', artist: 'Marconi Union' },
            { title: 'Clair de Lune', artist: 'Claude Debussy' },
            { title: 'Watermark', artist: 'Enya' },
            { title: 'Adagio for Strings', artist: 'Samuel Barber' },
            { title: 'Gymnopédie No. 1', artist: 'Erik Satie' },
            { title: 'Canon in D', artist: 'Johann Pachelbel' },
            { title: 'Experience', artist: 'Ludovico Einaudi' },
            { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi' },
            { title: 'River Flows in You', artist: 'Yiruma' },
            { title: 'Comptine d\'un autre été, l\'après-midi', artist: 'Yann Tiersen' },
            { title: 'Hoppípolla', artist: 'Sigur Rós' },
            { title: 'Only Time', artist: 'Enya' },
            { title: 'The Sound of Silence', artist: 'Simon & Garfunkel' },
            { title: 'Morning Mood', artist: 'Edvard Grieg' },
            { title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven' },
        ],
        relaxed: [
            { title: 'Ambient 1: Music for Airports', artist: 'Brian Eno' },
            { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi' },
            { title: 'Experience', artist: 'Ludovico Einaudi' },
            { title: 'Teardrop', artist: 'Massive Attack' },
            { title: 'Porcelain', artist: 'Moby' },
            { title: 'Flower Duet', artist: 'Léo Delibes' },
            { title: 'Pure Shores', artist: 'All Saints' },
            { title: 'One Day Like This', artist: 'Elbow' },
            { title: 'Into Dust', artist: 'Mazzy Star' },
            { title: 'Halving the Compass', artist: 'Helios' },
            { title: 'Asleep', artist: 'The Smiths' },
            { title: 'Fade Into You', artist: 'Mazzy Star' },
            { title: 'Nightcall', artist: 'Kavinsky' },
            { title: 'Midnight City', artist: 'M83' },
            { title: 'Intro', artist: 'The xx' },
        ],
        focused: [
            { title: 'Lo-fi Study', artist: 'Lofi Girl' },
            { title: 'Weightless', artist: 'Marconi Union' },
            { title: 'Flow State', artist: 'Tycho' },
            { title: 'Experience', artist: 'Ludovico Einaudi' },
            { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi' },
            { title: 'Comptine d\'un autre été, l\'après-midi', artist: 'Yann Tiersen' },
            { title: 'Gymnopédie No. 1', artist: 'Erik Satie' },
            { title: 'Adagio for Strings', artist: 'Samuel Barber' },
            { title: 'Time', artist: 'Hans Zimmer' },
            { title: 'Interstellar Main Theme', artist: 'Hans Zimmer' },
            { title: 'Arrival of the Birds', artist: 'The Cinematic Orchestra' },
            { title: 'The Scientist', artist: 'Coldplay' },
            { title: 'Chasing Cars', artist: 'Snow Patrol' },
            { title: 'Fix You', artist: 'Coldplay' },
            { title: 'Hallelujah', artist: 'Leonard Cohen' },
        ],
        irritated: [
            { title: 'Killing in the Name', artist: 'Rage Against The Machine' },
            { title: 'Chop Suey!', artist: 'System Of A Down' },
            { title: 'Break Stuff', artist: 'Limp Bizkit' },
            { title: 'Bulls on Parade', artist: 'Rage Against The Machine' },
            { title: 'Du Hast', artist: 'Rammstein' },
            { title: 'Psychosocial', artist: 'Slipknot' },
            { title: 'Walk', artist: 'Pantera' },
            { title: 'Enter Sandman', artist: 'Metallica' },
            { title: 'Smells Like Teen Spirit', artist: 'Nirvana' },
            { title: 'Last Resort', artist: 'Papa Roach' },
            { title: 'Bodies', artist: 'Drowning Pool' },
            { title: 'Down With The Sickness', artist: 'Disturbed' },
            { title: 'One Step Closer', artist: 'Linkin Park' },
            { title: 'Numb', artist: 'Linkin Park' },
            { title: 'Faint', artist: 'Linkin Park' },
        ],
        playful: [
            { title: 'Happy Together', artist: 'The Turtles' },
            { title: 'Walking on Sunshine', artist: 'Katrina & The Waves' },
            { title: 'Don\'t Stop Me Now', artist: 'Queen' },
            { title: 'I Want You Back', artist: 'The Jackson 5' },
            { title: 'September', artist: 'Earth, Wind & Fire' },
            { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
            { title: 'Can\'t Stop The Feeling!', artist: 'Justin Timberlake' },
            { title: 'Shake It Off', artist: 'Taylor Swift' },
            { title: 'Ain\'t No Mountain High Enough', artist: 'Marvin Gaye & Tammi Terrell' },
            { title: 'Three Little Birds', artist: 'Bob Marley & The Wailers' },
            { title: 'Celebration', artist: 'Kool & The Gang' },
            { title: 'Dancing Queen', artist: 'ABBA' },
            { title: 'Girls Just Want to Have Fun', artist: 'Cyndi Lauper' },
            { title: 'Wake Me Up Before You Go-Go', artist: 'Wham!' },
            { title: 'Livin\' La Vida Loca', artist: 'Ricky Martin' },
        ],
    };

    // --- Lógica de Troca de Tema ---
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeSwitcher.checked = true;
        themeLabel.textContent = '☀️';
    }

    themeSwitcher.addEventListener('change', () => {
        let theme = themeSwitcher.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeLabel.textContent = theme === 'dark' ? '☀️' : '🌙';
    });

    // --- Lógica de Seleção de Humor ---
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            selectMood(mood);
        });
    });

    // Função principal para selecionar um humor
    const selectMood = (mood) => {
        updateTheme(mood);
        generatePlaylist(mood);
        updateGamification(mood);
    };

    // Função para atualizar o tema e as cores da UI
    const updateTheme = (mood) => {
        body.setAttribute('data-mood', mood);
        // Define o atributo data-mood na seção da playlist para que o CSS possa aplicar a cor da borda
        playlistSection.setAttribute('data-mood', mood);
        // A transição de cor de fundo e borda agora é controlada puramente pelo CSS
        // A animação GSAP para a aparição da playlist ainda é válida
    };

    // Função para gerar a playlist na UI
    const generatePlaylist = (mood) => {
        const playlist = musicDB[mood];
        moodTitle.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
        playlistOutput.innerHTML = ''; // Limpa a lista anterior

        playlist.forEach(song => {
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = ` 
                <div>
                    <h5 class="mb-1">${song.title}</h5>
                    <p class="mb-1">${song.artist}</p>
                </div>
                <span class="badge bg-primary rounded-pill">▶️</span>
            `;
            playlistOutput.appendChild(listItem);
        });

        playlistSection.classList.remove('d-none');
        // Animação para a aparição da playlist
        gsap.fromTo('#playlist-section', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5 });
    };

    // --- Funções de Gamificação e Histórico (Simuladas) ---
    const updateGamification = (mood) => {
        const pointsElement = document.getElementById('points');
        const lastMoodElement = document.getElementById('last-mood');
        
        let currentPoints = parseInt(pointsElement.textContent);
        pointsElement.textContent = currentPoints + 10;
        lastMoodElement.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);
    };
});

// --- Funções de API (Simuladas) ---
function saveToSpotify() {
    alert('Playlist salva no Spotify! (Simulação)');
}

function saveToYouTubeMusic() {
    alert('Playlist salva no YouTube Music! (Simulação)');
}