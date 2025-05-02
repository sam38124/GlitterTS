import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { GVC } from '../glitterBundle/GVController.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { AiPointsApi } from '../glitter-base/route/ai-points-api.js';

export class FontsConfig {
  public static value = [
    {
      title: 'ABeeZee',
      value: 'ABeeZee',
    },
    {
      title: 'ADLaM Display',
      value: 'ADLaM Display',
    },
    {
      title: 'AR One Sans',
      value: 'AR One Sans',
    },
    {
      title: 'Abel',
      value: 'Abel',
    },
    {
      title: 'Abhaya Libre',
      value: 'Abhaya Libre',
    },
    {
      title: 'Aboreto',
      value: 'Aboreto',
    },
    {
      title: 'Abril Fatface',
      value: 'Abril Fatface',
    },
    {
      title: 'Abyssinica SIL',
      value: 'Abyssinica SIL',
    },
    {
      title: 'Aclonica',
      value: 'Aclonica',
    },
    {
      title: 'Acme',
      value: 'Acme',
    },
    {
      title: 'Actor',
      value: 'Actor',
    },
    {
      title: 'Adamina',
      value: 'Adamina',
    },
    {
      title: 'Advent Pro',
      value: 'Advent Pro',
    },
    {
      title: 'Afacad',
      value: 'Afacad',
    },
    {
      title: 'Agbalumo',
      value: 'Agbalumo',
    },
    {
      title: 'Agdasima',
      value: 'Agdasima',
    },
    {
      title: 'Aguafina Script',
      value: 'Aguafina Script',
    },
    {
      title: 'Akatab',
      value: 'Akatab',
    },
    {
      title: 'Akaya Kanadaka',
      value: 'Akaya Kanadaka',
    },
    {
      title: 'Akaya Telivigala',
      value: 'Akaya Telivigala',
    },
    {
      title: 'Akronim',
      value: 'Akronim',
    },
    {
      title: 'Akshar',
      value: 'Akshar',
    },
    {
      title: 'Aladin',
      value: 'Aladin',
    },
    {
      title: 'Alata',
      value: 'Alata',
    },
    {
      title: 'Alatsi',
      value: 'Alatsi',
    },
    {
      title: 'Albert Sans',
      value: 'Albert Sans',
    },
    {
      title: 'Aldrich',
      value: 'Aldrich',
    },
    {
      title: 'Alef',
      value: 'Alef',
    },
    {
      title: 'Alegreya',
      value: 'Alegreya',
    },
    {
      title: 'Alegreya SC',
      value: 'Alegreya SC',
    },
    {
      title: 'Alegreya Sans',
      value: 'Alegreya Sans',
    },
    {
      title: 'Alegreya Sans SC',
      value: 'Alegreya Sans SC',
    },
    {
      title: 'Aleo',
      value: 'Aleo',
    },
    {
      title: 'Alex Brush',
      value: 'Alex Brush',
    },
    {
      title: 'Alexandria',
      value: 'Alexandria',
    },
    {
      title: 'Alfa Slab One',
      value: 'Alfa Slab One',
    },
    {
      title: 'Alice',
      value: 'Alice',
    },
    {
      title: 'Alike',
      value: 'Alike',
    },
    {
      title: 'Alike Angular',
      value: 'Alike Angular',
    },
    {
      title: 'Alkalami',
      value: 'Alkalami',
    },
    {
      title: 'Alkatra',
      value: 'Alkatra',
    },
    {
      title: 'Allan',
      value: 'Allan',
    },
    {
      title: 'Allerta',
      value: 'Allerta',
    },
    {
      title: 'Allerta Stencil',
      value: 'Allerta Stencil',
    },
    {
      title: 'Allison',
      value: 'Allison',
    },
    {
      title: 'Allura',
      value: 'Allura',
    },
    {
      title: 'Almarai',
      value: 'Almarai',
    },
    {
      title: 'Almendra',
      value: 'Almendra',
    },
    {
      title: 'Almendra Display',
      value: 'Almendra Display',
    },
    {
      title: 'Almendra SC',
      value: 'Almendra SC',
    },
    {
      title: 'Alumni Sans',
      value: 'Alumni Sans',
    },
    {
      title: 'Alumni Sans Collegiate One',
      value: 'Alumni Sans Collegiate One',
    },
    {
      title: 'Alumni Sans Inline One',
      value: 'Alumni Sans Inline One',
    },
    {
      title: 'Alumni Sans Pinstripe',
      value: 'Alumni Sans Pinstripe',
    },
    {
      title: 'Amarante',
      value: 'Amarante',
    },
    {
      title: 'Amaranth',
      value: 'Amaranth',
    },
    {
      title: 'Amatic SC',
      value: 'Amatic SC',
    },
    {
      title: 'Amethysta',
      value: 'Amethysta',
    },
    {
      title: 'Amiko',
      value: 'Amiko',
    },
    {
      title: 'Amiri',
      value: 'Amiri',
    },
    {
      title: 'Amiri Quran',
      value: 'Amiri Quran',
    },
    {
      title: 'Amita',
      value: 'Amita',
    },
    {
      title: 'Anaheim',
      value: 'Anaheim',
    },
    {
      title: 'Andada Pro',
      value: 'Andada Pro',
    },
    {
      title: 'Andika',
      value: 'Andika',
    },
    {
      title: 'Anek Bangla',
      value: 'Anek Bangla',
    },
    {
      title: 'Anek Devanagari',
      value: 'Anek Devanagari',
    },
    {
      title: 'Anek Gujarati',
      value: 'Anek Gujarati',
    },
    {
      title: 'Anek Gurmukhi',
      value: 'Anek Gurmukhi',
    },
    {
      title: 'Anek Kannada',
      value: 'Anek Kannada',
    },
    {
      title: 'Anek Latin',
      value: 'Anek Latin',
    },
    {
      title: 'Anek Malayalam',
      value: 'Anek Malayalam',
    },
    {
      title: 'Anek Odia',
      value: 'Anek Odia',
    },
    {
      title: 'Anek Tamil',
      value: 'Anek Tamil',
    },
    {
      title: 'Anek Telugu',
      value: 'Anek Telugu',
    },
    {
      title: 'Angkor',
      value: 'Angkor',
    },
    {
      title: 'Annapurna SIL',
      value: 'Annapurna SIL',
    },
    {
      title: 'Annie Use Your Telescope',
      value: 'Annie Use Your Telescope',
    },
    {
      title: 'Anonymous Pro',
      value: 'Anonymous Pro',
    },
    {
      title: 'Anta',
      value: 'Anta',
    },
    {
      title: 'Antic',
      value: 'Antic',
    },
    {
      title: 'Antic Didone',
      value: 'Antic Didone',
    },
    {
      title: 'Antic Slab',
      value: 'Antic Slab',
    },
    {
      title: 'Anton',
      value: 'Anton',
    },
    {
      title: 'Anton SC',
      value: 'Anton SC',
    },
    {
      title: 'Antonio',
      value: 'Antonio',
    },
    {
      title: 'Anuphan',
      value: 'Anuphan',
    },
    {
      title: 'Anybody',
      value: 'Anybody',
    },
    {
      title: 'Aoboshi One',
      value: 'Aoboshi One',
    },
    {
      title: 'Arapey',
      value: 'Arapey',
    },
    {
      title: 'Arbutus',
      value: 'Arbutus',
    },
    {
      title: 'Arbutus Slab',
      value: 'Arbutus Slab',
    },
    {
      title: 'Architects Daughter',
      value: 'Architects Daughter',
    },
    {
      title: 'Archivo',
      value: 'Archivo',
    },
    {
      title: 'Archivo Black',
      value: 'Archivo Black',
    },
    {
      title: 'Archivo Narrow',
      value: 'Archivo Narrow',
    },
    {
      title: 'Are You Serious',
      value: 'Are You Serious',
    },
    {
      title: 'Aref Ruqaa',
      value: 'Aref Ruqaa',
    },
    {
      title: 'Aref Ruqaa Ink',
      value: 'Aref Ruqaa Ink',
    },
    {
      title: 'Arima',
      value: 'Arima',
    },
    {
      title: 'Arimo',
      value: 'Arimo',
    },
    {
      title: 'Arizonia',
      value: 'Arizonia',
    },
    {
      title: 'Armata',
      value: 'Armata',
    },
    {
      title: 'Arsenal',
      value: 'Arsenal',
    },
    {
      title: 'Arsenal SC',
      value: 'Arsenal SC',
    },
    {
      title: 'Artifika',
      value: 'Artifika',
    },
    {
      title: 'Arvo',
      value: 'Arvo',
    },
    {
      title: 'Arya',
      value: 'Arya',
    },
    {
      title: 'Asap',
      value: 'Asap',
    },
    {
      title: 'Asap Condensed',
      value: 'Asap Condensed',
    },
    {
      title: 'Asar',
      value: 'Asar',
    },
    {
      title: 'Asset',
      value: 'Asset',
    },
    {
      title: 'Assistant',
      value: 'Assistant',
    },
    {
      title: 'Astloch',
      value: 'Astloch',
    },
    {
      title: 'Asul',
      value: 'Asul',
    },
    {
      title: 'Athiti',
      value: 'Athiti',
    },
    {
      title: 'Atkinson Hyperlegible',
      value: 'Atkinson Hyperlegible',
    },
    {
      title: 'Atma',
      value: 'Atma',
    },
    {
      title: 'Atomic Age',
      value: 'Atomic Age',
    },
    {
      title: 'Aubrey',
      value: 'Aubrey',
    },
    {
      title: 'Audiowide',
      value: 'Audiowide',
    },
    {
      title: 'Autour One',
      value: 'Autour One',
    },
    {
      title: 'Average',
      value: 'Average',
    },
    {
      title: 'Average Sans',
      value: 'Average Sans',
    },
    {
      title: 'Averia Gruesa Libre',
      value: 'Averia Gruesa Libre',
    },
    {
      title: 'Averia Libre',
      value: 'Averia Libre',
    },
    {
      title: 'Averia Sans Libre',
      value: 'Averia Sans Libre',
    },
    {
      title: 'Averia Serif Libre',
      value: 'Averia Serif Libre',
    },
    {
      title: 'Azeret Mono',
      value: 'Azeret Mono',
    },
    {
      title: 'B612',
      value: 'B612',
    },
    {
      title: 'B612 Mono',
      value: 'B612 Mono',
    },
    {
      title: 'BIZ UDGothic',
      value: 'BIZ UDGothic',
    },
    {
      title: 'BIZ UDMincho',
      value: 'BIZ UDMincho',
    },
    {
      title: 'BIZ UDPGothic',
      value: 'BIZ UDPGothic',
    },
    {
      title: 'BIZ UDPMincho',
      value: 'BIZ UDPMincho',
    },
    {
      title: 'Babylonica',
      value: 'Babylonica',
    },
    {
      title: 'Bacasime Antique',
      value: 'Bacasime Antique',
    },
    {
      title: 'Bad Script',
      value: 'Bad Script',
    },
    {
      title: 'Bagel Fat One',
      value: 'Bagel Fat One',
    },
    {
      title: 'Bahiana',
      value: 'Bahiana',
    },
    {
      title: 'Bahianita',
      value: 'Bahianita',
    },
    {
      title: 'Bai Jamjuree',
      value: 'Bai Jamjuree',
    },
    {
      title: 'Bakbak One',
      value: 'Bakbak One',
    },
    {
      title: 'Ballet',
      value: 'Ballet',
    },
    {
      title: 'Baloo 2',
      value: 'Baloo 2',
    },
    {
      title: 'Baloo Bhai 2',
      value: 'Baloo Bhai 2',
    },
    {
      title: 'Baloo Bhaijaan 2',
      value: 'Baloo Bhaijaan 2',
    },
    {
      title: 'Baloo Bhaina 2',
      value: 'Baloo Bhaina 2',
    },
    {
      title: 'Baloo Chettan 2',
      value: 'Baloo Chettan 2',
    },
    {
      title: 'Baloo Da 2',
      value: 'Baloo Da 2',
    },
    {
      title: 'Baloo Paaji 2',
      value: 'Baloo Paaji 2',
    },
    {
      title: 'Baloo Tamma 2',
      value: 'Baloo Tamma 2',
    },
    {
      title: 'Baloo Tammudu 2',
      value: 'Baloo Tammudu 2',
    },
    {
      title: 'Baloo Thambi 2',
      value: 'Baloo Thambi 2',
    },
    {
      title: 'Balsamiq Sans',
      value: 'Balsamiq Sans',
    },
    {
      title: 'Balthazar',
      value: 'Balthazar',
    },
    {
      title: 'Bangers',
      value: 'Bangers',
    },
    {
      title: 'Barlow',
      value: 'Barlow',
    },
    {
      title: 'Barlow Condensed',
      value: 'Barlow Condensed',
    },
    {
      title: 'Barlow Semi Condensed',
      value: 'Barlow Semi Condensed',
    },
    {
      title: 'Barriecito',
      value: 'Barriecito',
    },
    {
      title: 'Barrio',
      value: 'Barrio',
    },
    {
      title: 'Basic',
      value: 'Basic',
    },
    {
      title: 'Baskervville',
      value: 'Baskervville',
    },
    {
      title: 'Baskervville SC',
      value: 'Baskervville SC',
    },
    {
      title: 'Battambang',
      value: 'Battambang',
    },
    {
      title: 'Baumans',
      value: 'Baumans',
    },
    {
      title: 'Bayon',
      value: 'Bayon',
    },
    {
      title: 'Be Vietnam Pro',
      value: 'Be Vietnam Pro',
    },
    {
      title: 'Beau Rivage',
      value: 'Beau Rivage',
    },
    {
      title: 'Bebas Neue',
      value: 'Bebas Neue',
    },
    {
      title: 'Beiruti',
      value: 'Beiruti',
    },
    {
      title: 'Belanosima',
      value: 'Belanosima',
    },
    {
      title: 'Belgrano',
      value: 'Belgrano',
    },
    {
      title: 'Bellefair',
      value: 'Bellefair',
    },
    {
      title: 'Belleza',
      value: 'Belleza',
    },
    {
      title: 'Bellota',
      value: 'Bellota',
    },
    {
      title: 'Bellota Text',
      value: 'Bellota Text',
    },
    {
      title: 'BenchNine',
      value: 'BenchNine',
    },
    {
      title: 'Benne',
      value: 'Benne',
    },
    {
      title: 'Bentham',
      value: 'Bentham',
    },
    {
      title: 'Berkshire Swash',
      value: 'Berkshire Swash',
    },
    {
      title: 'Besley',
      value: 'Besley',
    },
    {
      title: 'Beth Ellen',
      value: 'Beth Ellen',
    },
    {
      title: 'Bevan',
      value: 'Bevan',
    },
    {
      title: 'BhuTuka Expanded One',
      value: 'BhuTuka Expanded One',
    },
    {
      title: 'Big Shoulders Display',
      value: 'Big Shoulders Display',
    },
    {
      title: 'Big Shoulders Inline Display',
      value: 'Big Shoulders Inline Display',
    },
    {
      title: 'Big Shoulders Inline Text',
      value: 'Big Shoulders Inline Text',
    },
    {
      title: 'Big Shoulders Stencil Display',
      value: 'Big Shoulders Stencil Display',
    },
    {
      title: 'Big Shoulders Stencil Text',
      value: 'Big Shoulders Stencil Text',
    },
    {
      title: 'Big Shoulders Text',
      value: 'Big Shoulders Text',
    },
    {
      title: 'Bigelow Rules',
      value: 'Bigelow Rules',
    },
    {
      title: 'Bigshot One',
      value: 'Bigshot One',
    },
    {
      title: 'Bilbo',
      value: 'Bilbo',
    },
    {
      title: 'Bilbo Swash Caps',
      value: 'Bilbo Swash Caps',
    },
    {
      title: 'BioRhyme',
      value: 'BioRhyme',
    },
    {
      title: 'BioRhyme Expanded',
      value: 'BioRhyme Expanded',
    },
    {
      title: 'Birthstone',
      value: 'Birthstone',
    },
    {
      title: 'Birthstone Bounce',
      value: 'Birthstone Bounce',
    },
    {
      title: 'Biryani',
      value: 'Biryani',
    },
    {
      title: 'Bitter',
      value: 'Bitter',
    },
    {
      title: 'Black And White Picture',
      value: 'Black And White Picture',
    },
    {
      title: 'Black Han Sans',
      value: 'Black Han Sans',
    },
    {
      title: 'Black Ops One',
      value: 'Black Ops One',
    },
    {
      title: 'Blaka',
      value: 'Blaka',
    },
    {
      title: 'Blaka Hollow',
      value: 'Blaka Hollow',
    },
    {
      title: 'Blaka Ink',
      value: 'Blaka Ink',
    },
    {
      title: 'Blinker',
      value: 'Blinker',
    },
    {
      title: 'Bodoni Moda',
      value: 'Bodoni Moda',
    },
    {
      title: 'Bodoni Moda SC',
      value: 'Bodoni Moda SC',
    },
    {
      title: 'Bokor',
      value: 'Bokor',
    },
    {
      title: 'Bona Nova',
      value: 'Bona Nova',
    },
    {
      title: 'Bona Nova SC',
      value: 'Bona Nova SC',
    },
    {
      title: 'Bonbon',
      value: 'Bonbon',
    },
    {
      title: 'Bonheur Royale',
      value: 'Bonheur Royale',
    },
    {
      title: 'Boogaloo',
      value: 'Boogaloo',
    },
    {
      title: 'Borel',
      value: 'Borel',
    },
    {
      title: 'Bowlby One',
      value: 'Bowlby One',
    },
    {
      title: 'Bowlby One SC',
      value: 'Bowlby One SC',
    },
    {
      title: 'Braah One',
      value: 'Braah One',
    },
    {
      title: 'Brawler',
      value: 'Brawler',
    },
    {
      title: 'Bree Serif',
      value: 'Bree Serif',
    },
    {
      title: 'Bricolage Grotesque',
      value: 'Bricolage Grotesque',
    },
    {
      title: 'Bruno Ace',
      value: 'Bruno Ace',
    },
    {
      title: 'Bruno Ace SC',
      value: 'Bruno Ace SC',
    },
    {
      title: 'Brygada 1918',
      value: 'Brygada 1918',
    },
    {
      title: 'Bubblegum Sans',
      value: 'Bubblegum Sans',
    },
    {
      title: 'Bubbler One',
      value: 'Bubbler One',
    },
    {
      title: 'Buda',
      value: 'Buda',
    },
    {
      title: 'Buenard',
      value: 'Buenard',
    },
    {
      title: 'Bungee',
      value: 'Bungee',
    },
    {
      title: 'Bungee Hairline',
      value: 'Bungee Hairline',
    },
    {
      title: 'Bungee Inline',
      value: 'Bungee Inline',
    },
    {
      title: 'Bungee Outline',
      value: 'Bungee Outline',
    },
    {
      title: 'Bungee Shade',
      value: 'Bungee Shade',
    },
    {
      title: 'Bungee Spice',
      value: 'Bungee Spice',
    },
    {
      title: 'Butcherman',
      value: 'Butcherman',
    },
    {
      title: 'Butterfly Kids',
      value: 'Butterfly Kids',
    },
    {
      title: 'Cabin',
      value: 'Cabin',
    },
    {
      title: 'Cabin Condensed',
      value: 'Cabin Condensed',
    },
    {
      title: 'Cabin Sketch',
      value: 'Cabin Sketch',
    },
    {
      title: 'Cactus Classical Serif',
      value: 'Cactus Classical Serif',
    },
    {
      title: 'Caesar Dressing',
      value: 'Caesar Dressing',
    },
    {
      title: 'Cagliostro',
      value: 'Cagliostro',
    },
    {
      title: 'Cairo',
      value: 'Cairo',
    },
    {
      title: 'Cairo Play',
      value: 'Cairo Play',
    },
    {
      title: 'Caladea',
      value: 'Caladea',
    },
    {
      title: 'Calistoga',
      value: 'Calistoga',
    },
    {
      title: 'Calligraffitti',
      value: 'Calligraffitti',
    },
    {
      title: 'Cambay',
      value: 'Cambay',
    },
    {
      title: 'Cambo',
      value: 'Cambo',
    },
    {
      title: 'Candal',
      value: 'Candal',
    },
    {
      title: 'Cantarell',
      value: 'Cantarell',
    },
    {
      title: 'Cantata One',
      value: 'Cantata One',
    },
    {
      title: 'Cantora One',
      value: 'Cantora One',
    },
    {
      title: 'Caprasimo',
      value: 'Caprasimo',
    },
    {
      title: 'Capriola',
      value: 'Capriola',
    },
    {
      title: 'Caramel',
      value: 'Caramel',
    },
    {
      title: 'Carattere',
      value: 'Carattere',
    },
    {
      title: 'Cardo',
      value: 'Cardo',
    },
    {
      title: 'Carlito',
      value: 'Carlito',
    },
    {
      title: 'Carme',
      value: 'Carme',
    },
    {
      title: 'Carrois Gothic',
      value: 'Carrois Gothic',
    },
    {
      title: 'Carrois Gothic SC',
      value: 'Carrois Gothic SC',
    },
    {
      title: 'Carter One',
      value: 'Carter One',
    },
    {
      title: 'Castoro',
      value: 'Castoro',
    },
    {
      title: 'Castoro Titling',
      value: 'Castoro Titling',
    },
    {
      title: 'Catamaran',
      value: 'Catamaran',
    },
    {
      title: 'Caudex',
      value: 'Caudex',
    },
    {
      title: 'Caveat',
      value: 'Caveat',
    },
    {
      title: 'Caveat Brush',
      value: 'Caveat Brush',
    },
    {
      title: 'Cedarville Cursive',
      value: 'Cedarville Cursive',
    },
    {
      title: 'Ceviche One',
      value: 'Ceviche One',
    },
    {
      title: 'Chakra Petch',
      value: 'Chakra Petch',
    },
    {
      title: 'Changa',
      value: 'Changa',
    },
    {
      title: 'Changa One',
      value: 'Changa One',
    },
    {
      title: 'Chango',
      value: 'Chango',
    },
    {
      title: 'Charis SIL',
      value: 'Charis SIL',
    },
    {
      title: 'Charm',
      value: 'Charm',
    },
    {
      title: 'Charmonman',
      value: 'Charmonman',
    },
    {
      title: 'Chathura',
      value: 'Chathura',
    },
    {
      title: 'Chau Philomene One',
      value: 'Chau Philomene One',
    },
    {
      title: 'Chela One',
      value: 'Chela One',
    },
    {
      title: 'Chelsea Market',
      value: 'Chelsea Market',
    },
    {
      title: 'Chenla',
      value: 'Chenla',
    },
    {
      title: 'Cherish',
      value: 'Cherish',
    },
    {
      title: 'Cherry Bomb One',
      value: 'Cherry Bomb One',
    },
    {
      title: 'Cherry Cream Soda',
      value: 'Cherry Cream Soda',
    },
    {
      title: 'Cherry Swash',
      value: 'Cherry Swash',
    },
    {
      title: 'Chewy',
      value: 'Chewy',
    },
    {
      title: 'Chicle',
      value: 'Chicle',
    },
    {
      title: 'Chilanka',
      value: 'Chilanka',
    },
    {
      title: 'Chivo',
      value: 'Chivo',
    },
    {
      title: 'Chivo Mono',
      value: 'Chivo Mono',
    },
    {
      title: 'Chocolate Classical Sans',
      value: 'Chocolate Classical Sans',
    },
    {
      title: 'Chokokutai',
      value: 'Chokokutai',
    },
    {
      title: 'Chonburi',
      value: 'Chonburi',
    },
    {
      title: 'Cinzel',
      value: 'Cinzel',
    },
    {
      title: 'Cinzel Decorative',
      value: 'Cinzel Decorative',
    },
    {
      title: 'Clicker Script',
      value: 'Clicker Script',
    },
    {
      title: 'Climate Crisis',
      value: 'Climate Crisis',
    },
    {
      title: 'Coda',
      value: 'Coda',
    },
    {
      title: 'Codystar',
      value: 'Codystar',
    },
    {
      title: 'Coiny',
      value: 'Coiny',
    },
    {
      title: 'Combo',
      value: 'Combo',
    },
    {
      title: 'Comfortaa',
      value: 'Comfortaa',
    },
    {
      title: 'Comforter',
      value: 'Comforter',
    },
    {
      title: 'Comforter Brush',
      value: 'Comforter Brush',
    },
    {
      title: 'Comic Neue',
      value: 'Comic Neue',
    },
    {
      title: 'Coming Soon',
      value: 'Coming Soon',
    },
    {
      title: 'Comme',
      value: 'Comme',
    },
    {
      title: 'Commissioner',
      value: 'Commissioner',
    },
    {
      title: 'Concert One',
      value: 'Concert One',
    },
    {
      title: 'Condiment',
      value: 'Condiment',
    },
    {
      title: 'Content',
      value: 'Content',
    },
    {
      title: 'Contrail One',
      value: 'Contrail One',
    },
    {
      title: 'Convergence',
      value: 'Convergence',
    },
    {
      title: 'Cookie',
      value: 'Cookie',
    },
    {
      title: 'Copse',
      value: 'Copse',
    },
    {
      title: 'Corben',
      value: 'Corben',
    },
    {
      title: 'Corinthia',
      value: 'Corinthia',
    },
    {
      title: 'Cormorant',
      value: 'Cormorant',
    },
    {
      title: 'Cormorant Garamond',
      value: 'Cormorant Garamond',
    },
    {
      title: 'Cormorant Infant',
      value: 'Cormorant Infant',
    },
    {
      title: 'Cormorant SC',
      value: 'Cormorant SC',
    },
    {
      title: 'Cormorant Unicase',
      value: 'Cormorant Unicase',
    },
    {
      title: 'Cormorant Upright',
      value: 'Cormorant Upright',
    },
    {
      title: 'Courgette',
      value: 'Courgette',
    },
    {
      title: 'Courier Prime',
      value: 'Courier Prime',
    },
    {
      title: 'Cousine',
      value: 'Cousine',
    },
    {
      title: 'Coustard',
      value: 'Coustard',
    },
    {
      title: 'Covered By Your Grace',
      value: 'Covered By Your Grace',
    },
    {
      title: 'Crafty Girls',
      value: 'Crafty Girls',
    },
    {
      title: 'Creepster',
      value: 'Creepster',
    },
    {
      title: 'Crete Round',
      value: 'Crete Round',
    },
    {
      title: 'Crimson Pro',
      value: 'Crimson Pro',
    },
    {
      title: 'Crimson Text',
      value: 'Crimson Text',
    },
    {
      title: 'Croissant One',
      value: 'Croissant One',
    },
    {
      title: 'Crushed',
      value: 'Crushed',
    },
    {
      title: 'Cuprum',
      value: 'Cuprum',
    },
    {
      title: 'Cute Font',
      value: 'Cute Font',
    },
    {
      title: 'Cutive',
      value: 'Cutive',
    },
    {
      title: 'Cutive Mono',
      value: 'Cutive Mono',
    },
    {
      title: 'DM Mono',
      value: 'DM Mono',
    },
    {
      title: 'DM Sans',
      value: 'DM Sans',
    },
    {
      title: 'DM Serif Display',
      value: 'DM Serif Display',
    },
    {
      title: 'DM Serif Text',
      value: 'DM Serif Text',
    },
    {
      title: 'Dai Banna SIL',
      value: 'Dai Banna SIL',
    },
    {
      title: 'Damion',
      value: 'Damion',
    },
    {
      title: 'Dancing Script',
      value: 'Dancing Script',
    },
    {
      title: 'Danfo',
      value: 'Danfo',
    },
    {
      title: 'Dangrek',
      value: 'Dangrek',
    },
    {
      title: 'Darker Grotesque',
      value: 'Darker Grotesque',
    },
    {
      title: 'Darumadrop One',
      value: 'Darumadrop One',
    },
    {
      title: 'David Libre',
      value: 'David Libre',
    },
    {
      title: 'Dawning of a New Day',
      value: 'Dawning of a New Day',
    },
    {
      title: 'Days One',
      value: 'Days One',
    },
    {
      title: 'Dekko',
      value: 'Dekko',
    },
    {
      title: 'Dela Gothic One',
      value: 'Dela Gothic One',
    },
    {
      title: 'Delicious Handrawn',
      value: 'Delicious Handrawn',
    },
    {
      title: 'Delius',
      value: 'Delius',
    },
    {
      title: 'Delius Swash Caps',
      value: 'Delius Swash Caps',
    },
    {
      title: 'Delius Unicase',
      value: 'Delius Unicase',
    },
    {
      title: 'Della Respira',
      value: 'Della Respira',
    },
    {
      title: 'Denk One',
      value: 'Denk One',
    },
    {
      title: 'Devonshire',
      value: 'Devonshire',
    },
    {
      title: 'Dhurjati',
      value: 'Dhurjati',
    },
    {
      title: 'Didact Gothic',
      value: 'Didact Gothic',
    },
    {
      title: 'Diphylleia',
      value: 'Diphylleia',
    },
    {
      title: 'Diplomata',
      value: 'Diplomata',
    },
    {
      title: 'Diplomata SC',
      value: 'Diplomata SC',
    },
    {
      title: 'Do Hyeon',
      value: 'Do Hyeon',
    },
    {
      title: 'Dokdo',
      value: 'Dokdo',
    },
    {
      title: 'Domine',
      value: 'Domine',
    },
    {
      title: 'Donegal One',
      value: 'Donegal One',
    },
    {
      title: 'Dongle',
      value: 'Dongle',
    },
    {
      title: 'Doppio One',
      value: 'Doppio One',
    },
    {
      title: 'Dorsa',
      value: 'Dorsa',
    },
    {
      title: 'Dosis',
      value: 'Dosis',
    },
    {
      title: 'DotGothic16',
      value: 'DotGothic16',
    },
    {
      title: 'Dr Sugiyama',
      value: 'Dr Sugiyama',
    },
    {
      title: 'Duru Sans',
      value: 'Duru Sans',
    },
    {
      title: 'DynaPuff',
      value: 'DynaPuff',
    },
    {
      title: 'Dynalight',
      value: 'Dynalight',
    },
    {
      title: 'EB Garamond',
      value: 'EB Garamond',
    },
    {
      title: 'Eagle Lake',
      value: 'Eagle Lake',
    },
    {
      title: 'East Sea Dokdo',
      value: 'East Sea Dokdo',
    },
    {
      title: 'Eater',
      value: 'Eater',
    },
    {
      title: 'Economica',
      value: 'Economica',
    },
    {
      title: 'Eczar',
      value: 'Eczar',
    },
    {
      title: 'Edu AU VIC WA NT Hand',
      value: 'Edu AU VIC WA NT Hand',
    },
    {
      title: 'Edu NSW ACT Foundation',
      value: 'Edu NSW ACT Foundation',
    },
    {
      title: 'Edu QLD Beginner',
      value: 'Edu QLD Beginner',
    },
    {
      title: 'Edu SA Beginner',
      value: 'Edu SA Beginner',
    },
    {
      title: 'Edu TAS Beginner',
      value: 'Edu TAS Beginner',
    },
    {
      title: 'Edu VIC WA NT Beginner',
      value: 'Edu VIC WA NT Beginner',
    },
    {
      title: 'El Messiri',
      value: 'El Messiri',
    },
    {
      title: 'Electrolize',
      value: 'Electrolize',
    },
    {
      title: 'Elsie',
      value: 'Elsie',
    },
    {
      title: 'Elsie Swash Caps',
      value: 'Elsie Swash Caps',
    },
    {
      title: 'Emblema One',
      value: 'Emblema One',
    },
    {
      title: 'Emilys Candy',
      value: 'Emilys Candy',
    },
    {
      title: 'Encode Sans',
      value: 'Encode Sans',
    },
    {
      title: 'Encode Sans Condensed',
      value: 'Encode Sans Condensed',
    },
    {
      title: 'Encode Sans Expanded',
      value: 'Encode Sans Expanded',
    },
    {
      title: 'Encode Sans SC',
      value: 'Encode Sans SC',
    },
    {
      title: 'Encode Sans Semi Condensed',
      value: 'Encode Sans Semi Condensed',
    },
    {
      title: 'Encode Sans Semi Expanded',
      value: 'Encode Sans Semi Expanded',
    },
    {
      title: 'Engagement',
      value: 'Engagement',
    },
    {
      title: 'Englebert',
      value: 'Englebert',
    },
    {
      title: 'Enriqueta',
      value: 'Enriqueta',
    },
    {
      title: 'Ephesis',
      value: 'Ephesis',
    },
    {
      title: 'Epilogue',
      value: 'Epilogue',
    },
    {
      title: 'Erica One',
      value: 'Erica One',
    },
    {
      title: 'Esteban',
      value: 'Esteban',
    },
    {
      title: 'Estonia',
      value: 'Estonia',
    },
    {
      title: 'Euphoria Script',
      value: 'Euphoria Script',
    },
    {
      title: 'Ewert',
      value: 'Ewert',
    },
    {
      title: 'Exo',
      value: 'Exo',
    },
    {
      title: 'Exo 2',
      value: 'Exo 2',
    },
    {
      title: 'Expletus Sans',
      value: 'Expletus Sans',
    },
    {
      title: 'Explora',
      value: 'Explora',
    },
    {
      title: 'Fahkwang',
      value: 'Fahkwang',
    },
    {
      title: 'Familjen Grotesk',
      value: 'Familjen Grotesk',
    },
    {
      title: 'Fanwood Text',
      value: 'Fanwood Text',
    },
    {
      title: 'Farro',
      value: 'Farro',
    },
    {
      title: 'Farsan',
      value: 'Farsan',
    },
    {
      title: 'Fascinate',
      value: 'Fascinate',
    },
    {
      title: 'Fascinate Inline',
      value: 'Fascinate Inline',
    },
    {
      title: 'Faster One',
      value: 'Faster One',
    },
    {
      title: 'Fasthand',
      value: 'Fasthand',
    },
    {
      title: 'Fauna One',
      value: 'Fauna One',
    },
    {
      title: 'Faustina',
      value: 'Faustina',
    },
    {
      title: 'Federant',
      value: 'Federant',
    },
    {
      title: 'Federo',
      value: 'Federo',
    },
    {
      title: 'Felipa',
      value: 'Felipa',
    },
    {
      title: 'Fenix',
      value: 'Fenix',
    },
    {
      title: 'Festive',
      value: 'Festive',
    },
    {
      title: 'Figtree',
      value: 'Figtree',
    },
    {
      title: 'Finger Paint',
      value: 'Finger Paint',
    },
    {
      title: 'Finlandica',
      value: 'Finlandica',
    },
    {
      title: 'Fira Code',
      value: 'Fira Code',
    },
    {
      title: 'Fira Mono',
      value: 'Fira Mono',
    },
    {
      title: 'Fira Sans',
      value: 'Fira Sans',
    },
    {
      title: 'Fira Sans Condensed',
      value: 'Fira Sans Condensed',
    },
    {
      title: 'Fira Sans Extra Condensed',
      value: 'Fira Sans Extra Condensed',
    },
    {
      title: 'Fjalla One',
      value: 'Fjalla One',
    },
    {
      title: 'Fjord One',
      value: 'Fjord One',
    },
    {
      title: 'Flamenco',
      value: 'Flamenco',
    },
    {
      title: 'Flavors',
      value: 'Flavors',
    },
    {
      title: 'Fleur De Leah',
      value: 'Fleur De Leah',
    },
    {
      title: 'Flow Block',
      value: 'Flow Block',
    },
    {
      title: 'Flow Circular',
      value: 'Flow Circular',
    },
    {
      title: 'Flow Rounded',
      value: 'Flow Rounded',
    },
    {
      title: 'Foldit',
      value: 'Foldit',
    },
    {
      title: 'Fondamento',
      value: 'Fondamento',
    },
    {
      title: 'Fontdiner Swanky',
      value: 'Fontdiner Swanky',
    },
    {
      title: 'Forum',
      value: 'Forum',
    },
    {
      title: 'Fragment Mono',
      value: 'Fragment Mono',
    },
    {
      title: 'Francois One',
      value: 'Francois One',
    },
    {
      title: 'Frank Ruhl Libre',
      value: 'Frank Ruhl Libre',
    },
    {
      title: 'Fraunces',
      value: 'Fraunces',
    },
    {
      title: 'Freckle Face',
      value: 'Freckle Face',
    },
    {
      title: 'Fredericka the Great',
      value: 'Fredericka the Great',
    },
    {
      title: 'Fredoka',
      value: 'Fredoka',
    },
    {
      title: 'Freehand',
      value: 'Freehand',
    },
    {
      title: 'Freeman',
      value: 'Freeman',
    },
    {
      title: 'Fresca',
      value: 'Fresca',
    },
    {
      title: 'Frijole',
      value: 'Frijole',
    },
    {
      title: 'Fruktur',
      value: 'Fruktur',
    },
    {
      title: 'Fugaz One',
      value: 'Fugaz One',
    },
    {
      title: 'Fuggles',
      value: 'Fuggles',
    },
    {
      title: 'Fustat',
      value: 'Fustat',
    },
    {
      title: 'Fuzzy Bubbles',
      value: 'Fuzzy Bubbles',
    },
    {
      title: 'GFS Didot',
      value: 'GFS Didot',
    },
    {
      title: 'GFS Neohellenic',
      value: 'GFS Neohellenic',
    },
    {
      title: 'Ga Maamli',
      value: 'Ga Maamli',
    },
    {
      title: 'Gabarito',
      value: 'Gabarito',
    },
    {
      title: 'Gabriela',
      value: 'Gabriela',
    },
    {
      title: 'Gaegu',
      value: 'Gaegu',
    },
    {
      title: 'Gafata',
      value: 'Gafata',
    },
    {
      title: 'Gajraj One',
      value: 'Gajraj One',
    },
    {
      title: 'Galada',
      value: 'Galada',
    },
    {
      title: 'Galdeano',
      value: 'Galdeano',
    },
    {
      title: 'Galindo',
      value: 'Galindo',
    },
    {
      title: 'Gamja Flower',
      value: 'Gamja Flower',
    },
    {
      title: 'Gantari',
      value: 'Gantari',
    },
    {
      title: 'Gasoek One',
      value: 'Gasoek One',
    },
    {
      title: 'Gayathri',
      value: 'Gayathri',
    },
    {
      title: 'Gelasio',
      value: 'Gelasio',
    },
    {
      title: 'Gemunu Libre',
      value: 'Gemunu Libre',
    },
    {
      title: 'Genos',
      value: 'Genos',
    },
    {
      title: 'Gentium Book Plus',
      value: 'Gentium Book Plus',
    },
    {
      title: 'Gentium Plus',
      value: 'Gentium Plus',
    },
    {
      title: 'Geo',
      value: 'Geo',
    },
    {
      title: 'Geologica',
      value: 'Geologica',
    },
    {
      title: 'Georama',
      value: 'Georama',
    },
    {
      title: 'Geostar',
      value: 'Geostar',
    },
    {
      title: 'Geostar Fill',
      value: 'Geostar Fill',
    },
    {
      title: 'Germania One',
      value: 'Germania One',
    },
    {
      title: 'Gideon Roman',
      value: 'Gideon Roman',
    },
    {
      title: 'Gidugu',
      value: 'Gidugu',
    },
    {
      title: 'Gilda Display',
      value: 'Gilda Display',
    },
    {
      title: 'Girassol',
      value: 'Girassol',
    },
    {
      title: 'Give You Glory',
      value: 'Give You Glory',
    },
    {
      title: 'Glass Antiqua',
      value: 'Glass Antiqua',
    },
    {
      title: 'Glegoo',
      value: 'Glegoo',
    },
    {
      title: 'Gloock',
      value: 'Gloock',
    },
    {
      title: 'Gloria Hallelujah',
      value: 'Gloria Hallelujah',
    },
    {
      title: 'Glory',
      value: 'Glory',
    },
    {
      title: 'Gluten',
      value: 'Gluten',
    },
    {
      title: 'Goblin One',
      value: 'Goblin One',
    },
    {
      title: 'Gochi Hand',
      value: 'Gochi Hand',
    },
    {
      title: 'Goldman',
      value: 'Goldman',
    },
    {
      title: 'Golos Text',
      value: 'Golos Text',
    },
    {
      title: 'Gorditas',
      value: 'Gorditas',
    },
    {
      title: 'Gothic A1',
      value: 'Gothic A1',
    },
    {
      title: 'Gotu',
      value: 'Gotu',
    },
    {
      title: 'Goudy Bookletter 1911',
      value: 'Goudy Bookletter 1911',
    },
    {
      title: 'Gowun Batang',
      value: 'Gowun Batang',
    },
    {
      title: 'Gowun Dodum',
      value: 'Gowun Dodum',
    },
    {
      title: 'Graduate',
      value: 'Graduate',
    },
    {
      title: 'Grand Hotel',
      value: 'Grand Hotel',
    },
    {
      title: 'Grandiflora One',
      value: 'Grandiflora One',
    },
    {
      title: 'Grandstander',
      value: 'Grandstander',
    },
    {
      title: 'Grape Nuts',
      value: 'Grape Nuts',
    },
    {
      title: 'Gravitas One',
      value: 'Gravitas One',
    },
    {
      title: 'Great Vibes',
      value: 'Great Vibes',
    },
    {
      title: 'Grechen Fuemen',
      value: 'Grechen Fuemen',
    },
    {
      title: 'Grenze',
      value: 'Grenze',
    },
    {
      title: 'Grenze Gotisch',
      value: 'Grenze Gotisch',
    },
    {
      title: 'Grey Qo',
      value: 'Grey Qo',
    },
    {
      title: 'Griffy',
      value: 'Griffy',
    },
    {
      title: 'Gruppo',
      value: 'Gruppo',
    },
    {
      title: 'Gudea',
      value: 'Gudea',
    },
    {
      title: 'Gugi',
      value: 'Gugi',
    },
    {
      title: 'Gulzar',
      value: 'Gulzar',
    },
    {
      title: 'Gupter',
      value: 'Gupter',
    },
    {
      title: 'Gurajada',
      value: 'Gurajada',
    },
    {
      title: 'Gwendolyn',
      value: 'Gwendolyn',
    },
    {
      title: 'Habibi',
      value: 'Habibi',
    },
    {
      title: 'Hachi Maru Pop',
      value: 'Hachi Maru Pop',
    },
    {
      title: 'Hahmlet',
      value: 'Hahmlet',
    },
    {
      title: 'Halant',
      value: 'Halant',
    },
    {
      title: 'Hammersmith One',
      value: 'Hammersmith One',
    },
    {
      title: 'Hanalei',
      value: 'Hanalei',
    },
    {
      title: 'Hanalei Fill',
      value: 'Hanalei Fill',
    },
    {
      title: 'Handjet',
      value: 'Handjet',
    },
    {
      title: 'Handlee',
      value: 'Handlee',
    },
    {
      title: 'Hanken Grotesk',
      value: 'Hanken Grotesk',
    },
    {
      title: 'Hanuman',
      value: 'Hanuman',
    },
    {
      title: 'Happy Monkey',
      value: 'Happy Monkey',
    },
    {
      title: 'Harmattan',
      value: 'Harmattan',
    },
    {
      title: 'Headland One',
      value: 'Headland One',
    },
    {
      title: 'Hedvig Letters Sans',
      value: 'Hedvig Letters Sans',
    },
    {
      title: 'Hedvig Letters Serif',
      value: 'Hedvig Letters Serif',
    },
    {
      title: 'Heebo',
      value: 'Heebo',
    },
    {
      title: 'Henny Penny',
      value: 'Henny Penny',
    },
    {
      title: 'Hepta Slab',
      value: 'Hepta Slab',
    },
    {
      title: 'Herr Von Muellerhoff',
      value: 'Herr Von Muellerhoff',
    },
    {
      title: 'Hi Melody',
      value: 'Hi Melody',
    },
    {
      title: 'Hina Mincho',
      value: 'Hina Mincho',
    },
    {
      title: 'Hind',
      value: 'Hind',
    },
    {
      title: 'Hind Guntur',
      value: 'Hind Guntur',
    },
    {
      title: 'Hind Madurai',
      value: 'Hind Madurai',
    },
    {
      title: 'Hind Siliguri',
      value: 'Hind Siliguri',
    },
    {
      title: 'Hind Vadodara',
      value: 'Hind Vadodara',
    },
    {
      title: 'Holtwood One SC',
      value: 'Holtwood One SC',
    },
    {
      title: 'Homemade Apple',
      value: 'Homemade Apple',
    },
    {
      title: 'Homenaje',
      value: 'Homenaje',
    },
    {
      title: 'Honk',
      value: 'Honk',
    },
    {
      title: 'Hubballi',
      value: 'Hubballi',
    },
    {
      title: 'Hurricane',
      value: 'Hurricane',
    },
    {
      title: 'IBM Plex Mono',
      value: 'IBM Plex Mono',
    },
    {
      title: 'IBM Plex Sans',
      value: 'IBM Plex Sans',
    },
    {
      title: 'IBM Plex Sans Arabic',
      value: 'IBM Plex Sans Arabic',
    },
    {
      title: 'IBM Plex Sans Condensed',
      value: 'IBM Plex Sans Condensed',
    },
    {
      title: 'IBM Plex Sans Devanagari',
      value: 'IBM Plex Sans Devanagari',
    },
    {
      title: 'IBM Plex Sans Hebrew',
      value: 'IBM Plex Sans Hebrew',
    },
    {
      title: 'IBM Plex Sans JP',
      value: 'IBM Plex Sans JP',
    },
    {
      title: 'IBM Plex Sans KR',
      value: 'IBM Plex Sans KR',
    },
    {
      title: 'IBM Plex Sans Thai',
      value: 'IBM Plex Sans Thai',
    },
    {
      title: 'IBM Plex Sans Thai Looped',
      value: 'IBM Plex Sans Thai Looped',
    },
    {
      title: 'IBM Plex Serif',
      value: 'IBM Plex Serif',
    },
    {
      title: 'IM Fell DW Pica',
      value: 'IM Fell DW Pica',
    },
    {
      title: 'IM Fell DW Pica SC',
      value: 'IM Fell DW Pica SC',
    },
    {
      title: 'IM Fell Double Pica',
      value: 'IM Fell Double Pica',
    },
    {
      title: 'IM Fell Double Pica SC',
      value: 'IM Fell Double Pica SC',
    },
    {
      title: 'IM Fell English',
      value: 'IM Fell English',
    },
    {
      title: 'IM Fell English SC',
      value: 'IM Fell English SC',
    },
    {
      title: 'IM Fell French Canon',
      value: 'IM Fell French Canon',
    },
    {
      title: 'IM Fell French Canon SC',
      value: 'IM Fell French Canon SC',
    },
    {
      title: 'IM Fell Great Primer',
      value: 'IM Fell Great Primer',
    },
    {
      title: 'IM Fell Great Primer SC',
      value: 'IM Fell Great Primer SC',
    },
    {
      title: 'Ibarra Real Nova',
      value: 'Ibarra Real Nova',
    },
    {
      title: 'Iceberg',
      value: 'Iceberg',
    },
    {
      title: 'Iceland',
      value: 'Iceland',
    },
    {
      title: 'Imbue',
      value: 'Imbue',
    },
    {
      title: 'Imperial Script',
      value: 'Imperial Script',
    },
    {
      title: 'Imprima',
      value: 'Imprima',
    },
    {
      title: 'Inclusive Sans',
      value: 'Inclusive Sans',
    },
    {
      title: 'Inconsolata',
      value: 'Inconsolata',
    },
    {
      title: 'Inder',
      value: 'Inder',
    },
    {
      title: 'Indie Flower',
      value: 'Indie Flower',
    },
    {
      title: 'Ingrid Darling',
      value: 'Ingrid Darling',
    },
    {
      title: 'Inika',
      value: 'Inika',
    },
    {
      title: 'Inknut Antiqua',
      value: 'Inknut Antiqua',
    },
    {
      title: 'Inria Sans',
      value: 'Inria Sans',
    },
    {
      title: 'Inria Serif',
      value: 'Inria Serif',
    },
    {
      title: 'Inspiration',
      value: 'Inspiration',
    },
    {
      title: 'Instrument Sans',
      value: 'Instrument Sans',
    },
    {
      title: 'Instrument Serif',
      value: 'Instrument Serif',
    },
    {
      title: 'Inter',
      value: 'Inter',
    },
    {
      title: 'Inter Tight',
      value: 'Inter Tight',
    },
    {
      title: 'Irish Grover',
      value: 'Irish Grover',
    },
    {
      title: 'Island Moments',
      value: 'Island Moments',
    },
    {
      title: 'Istok Web',
      value: 'Istok Web',
    },
    {
      title: 'Italiana',
      value: 'Italiana',
    },
    {
      title: 'Italianno',
      value: 'Italianno',
    },
    {
      title: 'Itim',
      value: 'Itim',
    },
    {
      title: 'Jacquard 12',
      value: 'Jacquard 12',
    },
    {
      title: 'Jacquard 12 Charted',
      value: 'Jacquard 12 Charted',
    },
    {
      title: 'Jacquard 24',
      value: 'Jacquard 24',
    },
    {
      title: 'Jacquard 24 Charted',
      value: 'Jacquard 24 Charted',
    },
    {
      title: 'Jacquarda Bastarda 9',
      value: 'Jacquarda Bastarda 9',
    },
    {
      title: 'Jacquarda Bastarda 9 Charted',
      value: 'Jacquarda Bastarda 9 Charted',
    },
    {
      title: 'Jacques Francois',
      value: 'Jacques Francois',
    },
    {
      title: 'Jacques Francois Shadow',
      value: 'Jacques Francois Shadow',
    },
    {
      title: 'Jaini',
      value: 'Jaini',
    },
    {
      title: 'Jaini Purva',
      value: 'Jaini Purva',
    },
    {
      title: 'Jaldi',
      value: 'Jaldi',
    },
    {
      title: 'Jaro',
      value: 'Jaro',
    },
    {
      title: 'Jersey 10',
      value: 'Jersey 10',
    },
    {
      title: 'Jersey 10 Charted',
      value: 'Jersey 10 Charted',
    },
    {
      title: 'Jersey 15',
      value: 'Jersey 15',
    },
    {
      title: 'Jersey 15 Charted',
      value: 'Jersey 15 Charted',
    },
    {
      title: 'Jersey 20',
      value: 'Jersey 20',
    },
    {
      title: 'Jersey 20 Charted',
      value: 'Jersey 20 Charted',
    },
    {
      title: 'Jersey 25',
      value: 'Jersey 25',
    },
    {
      title: 'Jersey 25 Charted',
      value: 'Jersey 25 Charted',
    },
    {
      title: 'JetBrains Mono',
      value: 'JetBrains Mono',
    },
    {
      title: 'Jim Nightshade',
      value: 'Jim Nightshade',
    },
    {
      title: 'Joan',
      value: 'Joan',
    },
    {
      title: 'Jockey One',
      value: 'Jockey One',
    },
    {
      title: 'Jolly Lodger',
      value: 'Jolly Lodger',
    },
    {
      title: 'Jomhuria',
      value: 'Jomhuria',
    },
    {
      title: 'Jomolhari',
      value: 'Jomolhari',
    },
    {
      title: 'Josefin Sans',
      value: 'Josefin Sans',
    },
    {
      title: 'Josefin Slab',
      value: 'Josefin Slab',
    },
    {
      title: 'Jost',
      value: 'Jost',
    },
    {
      title: 'Joti One',
      value: 'Joti One',
    },
    {
      title: 'Jua',
      value: 'Jua',
    },
    {
      title: 'Judson',
      value: 'Judson',
    },
    {
      title: 'Julee',
      value: 'Julee',
    },
    {
      title: 'Julius Sans One',
      value: 'Julius Sans One',
    },
    {
      title: 'Junge',
      value: 'Junge',
    },
    {
      title: 'Jura',
      value: 'Jura',
    },
    {
      title: 'Just Another Hand',
      value: 'Just Another Hand',
    },
    {
      title: 'Just Me Again Down Here',
      value: 'Just Me Again Down Here',
    },
    {
      title: 'K2D',
      value: 'K2D',
    },
    {
      title: 'Kablammo',
      value: 'Kablammo',
    },
    {
      title: 'Kadwa',
      value: 'Kadwa',
    },
    {
      title: 'Kaisei Decol',
      value: 'Kaisei Decol',
    },
    {
      title: 'Kaisei HarunoUmi',
      value: 'Kaisei HarunoUmi',
    },
    {
      title: 'Kaisei Opti',
      value: 'Kaisei Opti',
    },
    {
      title: 'Kaisei Tokumin',
      value: 'Kaisei Tokumin',
    },
    {
      title: 'Kalam',
      value: 'Kalam',
    },
    {
      title: 'Kalnia',
      value: 'Kalnia',
    },
    {
      title: 'Kalnia Glaze',
      value: 'Kalnia Glaze',
    },
    {
      title: 'Kameron',
      value: 'Kameron',
    },
    {
      title: 'Kanit',
      value: 'Kanit',
    },
    {
      title: 'Kantumruy Pro',
      value: 'Kantumruy Pro',
    },
    {
      title: 'Karantina',
      value: 'Karantina',
    },
    {
      title: 'Karla',
      value: 'Karla',
    },
    {
      title: 'Karma',
      value: 'Karma',
    },
    {
      title: 'Katibeh',
      value: 'Katibeh',
    },
    {
      title: 'Kaushan Script',
      value: 'Kaushan Script',
    },
    {
      title: 'Kavivanar',
      value: 'Kavivanar',
    },
    {
      title: 'Kavoon',
      value: 'Kavoon',
    },
    {
      title: 'Kay Pho Du',
      value: 'Kay Pho Du',
    },
    {
      title: 'Kdam Thmor Pro',
      value: 'Kdam Thmor Pro',
    },
    {
      title: 'Keania One',
      value: 'Keania One',
    },
    {
      title: 'Kelly Slab',
      value: 'Kelly Slab',
    },
    {
      title: 'Kenia',
      value: 'Kenia',
    },
    {
      title: 'Khand',
      value: 'Khand',
    },
    {
      title: 'Khmer',
      value: 'Khmer',
    },
    {
      title: 'Khula',
      value: 'Khula',
    },
    {
      title: 'Kings',
      value: 'Kings',
    },
    {
      title: 'Kirang Haerang',
      value: 'Kirang Haerang',
    },
    {
      title: 'Kite One',
      value: 'Kite One',
    },
    {
      title: 'Kiwi Maru',
      value: 'Kiwi Maru',
    },
    {
      title: 'Klee One',
      value: 'Klee One',
    },
    {
      title: 'Knewave',
      value: 'Knewave',
    },
    {
      title: 'KoHo',
      value: 'KoHo',
    },
    {
      title: 'Kodchasan',
      value: 'Kodchasan',
    },
    {
      title: 'Kode Mono',
      value: 'Kode Mono',
    },
    {
      title: 'Koh Santepheap',
      value: 'Koh Santepheap',
    },
    {
      title: 'Kolker Brush',
      value: 'Kolker Brush',
    },
    {
      title: 'Konkhmer Sleokchher',
      value: 'Konkhmer Sleokchher',
    },
    {
      title: 'Kosugi',
      value: 'Kosugi',
    },
    {
      title: 'Kosugi Maru',
      value: 'Kosugi Maru',
    },
    {
      title: 'Kotta One',
      value: 'Kotta One',
    },
    {
      title: 'Koulen',
      value: 'Koulen',
    },
    {
      title: 'Kranky',
      value: 'Kranky',
    },
    {
      title: 'Kreon',
      value: 'Kreon',
    },
    {
      title: 'Kristi',
      value: 'Kristi',
    },
    {
      title: 'Krona One',
      value: 'Krona One',
    },
    {
      title: 'Krub',
      value: 'Krub',
    },
    {
      title: 'Kufam',
      value: 'Kufam',
    },
    {
      title: 'Kulim Park',
      value: 'Kulim Park',
    },
    {
      title: 'Kumar One',
      value: 'Kumar One',
    },
    {
      title: 'Kumar One Outline',
      value: 'Kumar One Outline',
    },
    {
      title: 'Kumbh Sans',
      value: 'Kumbh Sans',
    },
    {
      title: 'Kurale',
      value: 'Kurale',
    },
    {
      title: 'LXGW WenKai Mono TC',
      value: 'LXGW WenKai Mono TC',
    },
    {
      title: 'LXGW WenKai TC',
      value: 'LXGW WenKai TC',
    },
    {
      title: 'La Belle Aurore',
      value: 'La Belle Aurore',
    },
    {
      title: 'Labrada',
      value: 'Labrada',
    },
    {
      title: 'Lacquer',
      value: 'Lacquer',
    },
    {
      title: 'Laila',
      value: 'Laila',
    },
    {
      title: 'Lakki Reddy',
      value: 'Lakki Reddy',
    },
    {
      title: 'Lalezar',
      value: 'Lalezar',
    },
    {
      title: 'Lancelot',
      value: 'Lancelot',
    },
    {
      title: 'Langar',
      value: 'Langar',
    },
    {
      title: 'Lateef',
      value: 'Lateef',
    },
    {
      title: 'Lato',
      value: 'Lato',
    },
    {
      title: 'Lavishly Yours',
      value: 'Lavishly Yours',
    },
    {
      title: 'League Gothic',
      value: 'League Gothic',
    },
    {
      title: 'League Script',
      value: 'League Script',
    },
    {
      title: 'League Spartan',
      value: 'League Spartan',
    },
    {
      title: 'Leckerli One',
      value: 'Leckerli One',
    },
    {
      title: 'Ledger',
      value: 'Ledger',
    },
    {
      title: 'Lekton',
      value: 'Lekton',
    },
    {
      title: 'Lemon',
      value: 'Lemon',
    },
    {
      title: 'Lemonada',
      value: 'Lemonada',
    },
    {
      title: 'Lexend',
      value: 'Lexend',
    },
    {
      title: 'Lexend Deca',
      value: 'Lexend Deca',
    },
    {
      title: 'Lexend Exa',
      value: 'Lexend Exa',
    },
    {
      title: 'Lexend Giga',
      value: 'Lexend Giga',
    },
    {
      title: 'Lexend Mega',
      value: 'Lexend Mega',
    },
    {
      title: 'Lexend Peta',
      value: 'Lexend Peta',
    },
    {
      title: 'Lexend Tera',
      value: 'Lexend Tera',
    },
    {
      title: 'Lexend Zetta',
      value: 'Lexend Zetta',
    },
    {
      title: 'Libre Barcode 128',
      value: 'Libre Barcode 128',
    },
    {
      title: 'Libre Barcode 128 Text',
      value: 'Libre Barcode 128 Text',
    },
    {
      title: 'Libre Barcode 39',
      value: 'Libre Barcode 39',
    },
    {
      title: 'Libre Barcode 39 Extended',
      value: 'Libre Barcode 39 Extended',
    },
    {
      title: 'Libre Barcode 39 Extended Text',
      value: 'Libre Barcode 39 Extended Text',
    },
    {
      title: 'Libre Barcode 39 Text',
      value: 'Libre Barcode 39 Text',
    },
    {
      title: 'Libre Barcode EAN13 Text',
      value: 'Libre Barcode EAN13 Text',
    },
    {
      title: 'Libre Baskerville',
      value: 'Libre Baskerville',
    },
    {
      title: 'Libre Bodoni',
      value: 'Libre Bodoni',
    },
    {
      title: 'Libre Caslon Display',
      value: 'Libre Caslon Display',
    },
    {
      title: 'Libre Caslon Text',
      value: 'Libre Caslon Text',
    },
    {
      title: 'Libre Franklin',
      value: 'Libre Franklin',
    },
    {
      title: 'Licorice',
      value: 'Licorice',
    },
    {
      title: 'Life Savers',
      value: 'Life Savers',
    },
    {
      title: 'Lilita One',
      value: 'Lilita One',
    },
    {
      title: 'Lily Script One',
      value: 'Lily Script One',
    },
    {
      title: 'Limelight',
      value: 'Limelight',
    },
    {
      title: 'Linden Hill',
      value: 'Linden Hill',
    },
    {
      title: 'Linefont',
      value: 'Linefont',
    },
    {
      title: 'Lisu Bosa',
      value: 'Lisu Bosa',
    },
    {
      title: 'Literata',
      value: 'Literata',
    },
    {
      title: 'Liu Jian Mao Cao',
      value: 'Liu Jian Mao Cao',
    },
    {
      title: 'Livvic',
      value: 'Livvic',
    },
    {
      title: 'Lobster',
      value: 'Lobster',
    },
    {
      title: 'Lobster Two',
      value: 'Lobster Two',
    },
    {
      title: 'Londrina Outline',
      value: 'Londrina Outline',
    },
    {
      title: 'Londrina Shadow',
      value: 'Londrina Shadow',
    },
    {
      title: 'Londrina Sketch',
      value: 'Londrina Sketch',
    },
    {
      title: 'Londrina Solid',
      value: 'Londrina Solid',
    },
    {
      title: 'Long Cang',
      value: 'Long Cang',
    },
    {
      title: 'Lora',
      value: 'Lora',
    },
    {
      title: 'Love Light',
      value: 'Love Light',
    },
    {
      title: 'Love Ya Like A Sister',
      value: 'Love Ya Like A Sister',
    },
    {
      title: 'Loved by the King',
      value: 'Loved by the King',
    },
    {
      title: 'Lovers Quarrel',
      value: 'Lovers Quarrel',
    },
    {
      title: 'Luckiest Guy',
      value: 'Luckiest Guy',
    },
    {
      title: 'Lugrasimo',
      value: 'Lugrasimo',
    },
    {
      title: 'Lumanosimo',
      value: 'Lumanosimo',
    },
    {
      title: 'Lunasima',
      value: 'Lunasima',
    },
    {
      title: 'Lusitana',
      value: 'Lusitana',
    },
    {
      title: 'Lustria',
      value: 'Lustria',
    },
    {
      title: 'Luxurious Roman',
      value: 'Luxurious Roman',
    },
    {
      title: 'Luxurious Script',
      value: 'Luxurious Script',
    },
    {
      title: 'M PLUS 1',
      value: 'M PLUS 1',
    },
    {
      title: 'M PLUS 1 Code',
      value: 'M PLUS 1 Code',
    },
    {
      title: 'M PLUS 1p',
      value: 'M PLUS 1p',
    },
    {
      title: 'M PLUS 2',
      value: 'M PLUS 2',
    },
    {
      title: 'M PLUS Code Latin',
      value: 'M PLUS Code Latin',
    },
    {
      title: 'M PLUS Rounded 1c',
      value: 'M PLUS Rounded 1c',
    },
    {
      title: 'Ma Shan Zheng',
      value: 'Ma Shan Zheng',
    },
    {
      title: 'Macondo',
      value: 'Macondo',
    },
    {
      title: 'Macondo Swash Caps',
      value: 'Macondo Swash Caps',
    },
    {
      title: 'Mada',
      value: 'Mada',
    },
    {
      title: 'Madimi One',
      value: 'Madimi One',
    },
    {
      title: 'Magra',
      value: 'Magra',
    },
    {
      title: 'Maiden Orange',
      value: 'Maiden Orange',
    },
    {
      title: 'Maitree',
      value: 'Maitree',
    },
    {
      title: 'Major Mono Display',
      value: 'Major Mono Display',
    },
    {
      title: 'Mako',
      value: 'Mako',
    },
    {
      title: 'Mali',
      value: 'Mali',
    },
    {
      title: 'Mallanna',
      value: 'Mallanna',
    },
    {
      title: 'Maname',
      value: 'Maname',
    },
    {
      title: 'Mandali',
      value: 'Mandali',
    },
    {
      title: 'Manjari',
      value: 'Manjari',
    },
    {
      title: 'Manrope',
      value: 'Manrope',
    },
    {
      title: 'Mansalva',
      value: 'Mansalva',
    },
    {
      title: 'Manuale',
      value: 'Manuale',
    },
    {
      title: 'Marcellus',
      value: 'Marcellus',
    },
    {
      title: 'Marcellus SC',
      value: 'Marcellus SC',
    },
    {
      title: 'Marck Script',
      value: 'Marck Script',
    },
    {
      title: 'Margarine',
      value: 'Margarine',
    },
    {
      title: 'Marhey',
      value: 'Marhey',
    },
    {
      title: 'Markazi Text',
      value: 'Markazi Text',
    },
    {
      title: 'Marko One',
      value: 'Marko One',
    },
    {
      title: 'Marmelad',
      value: 'Marmelad',
    },
    {
      title: 'Martel',
      value: 'Martel',
    },
    {
      title: 'Martel Sans',
      value: 'Martel Sans',
    },
    {
      title: 'Martian Mono',
      value: 'Martian Mono',
    },
    {
      title: 'Marvel',
      value: 'Marvel',
    },
    {
      title: 'Mate',
      value: 'Mate',
    },
    {
      title: 'Mate SC',
      value: 'Mate SC',
    },
    {
      title: 'Material Icons',
      value: 'Material Icons',
    },
    {
      title: 'Material Icons Outlined',
      value: 'Material Icons Outlined',
    },
    {
      title: 'Material Icons Round',
      value: 'Material Icons Round',
    },
    {
      title: 'Material Icons Sharp',
      value: 'Material Icons Sharp',
    },
    {
      title: 'Material Icons Two Tone',
      value: 'Material Icons Two Tone',
    },
    {
      title: 'Material Symbols Outlined',
      value: 'Material Symbols Outlined',
    },
    {
      title: 'Material Symbols Rounded',
      value: 'Material Symbols Rounded',
    },
    {
      title: 'Material Symbols Sharp',
      value: 'Material Symbols Sharp',
    },
    {
      title: 'Maven Pro',
      value: 'Maven Pro',
    },
    {
      title: 'McLaren',
      value: 'McLaren',
    },
    {
      title: 'Mea Culpa',
      value: 'Mea Culpa',
    },
    {
      title: 'Meddon',
      value: 'Meddon',
    },
    {
      title: 'MedievalSharp',
      value: 'MedievalSharp',
    },
    {
      title: 'Medula One',
      value: 'Medula One',
    },
    {
      title: 'Meera Inimai',
      value: 'Meera Inimai',
    },
    {
      title: 'Megrim',
      value: 'Megrim',
    },
    {
      title: 'Meie Script',
      value: 'Meie Script',
    },
    {
      title: 'Meow Script',
      value: 'Meow Script',
    },
    {
      title: 'Merienda',
      value: 'Merienda',
    },
    {
      title: 'Merriweather',
      value: 'Merriweather',
    },
    {
      title: 'Merriweather Sans',
      value: 'Merriweather Sans',
    },
    {
      title: 'Metal',
      value: 'Metal',
    },
    {
      title: 'Metal Mania',
      value: 'Metal Mania',
    },
    {
      title: 'Metamorphous',
      value: 'Metamorphous',
    },
    {
      title: 'Metrophobic',
      value: 'Metrophobic',
    },
    {
      title: 'Michroma',
      value: 'Michroma',
    },
    {
      title: 'Micro 5',
      value: 'Micro 5',
    },
    {
      title: 'Micro 5 Charted',
      value: 'Micro 5 Charted',
    },
    {
      title: 'Milonga',
      value: 'Milonga',
    },
    {
      title: 'Miltonian',
      value: 'Miltonian',
    },
    {
      title: 'Miltonian Tattoo',
      value: 'Miltonian Tattoo',
    },
    {
      title: 'Mina',
      value: 'Mina',
    },
    {
      title: 'Mingzat',
      value: 'Mingzat',
    },
    {
      title: 'Miniver',
      value: 'Miniver',
    },
    {
      title: 'Miriam Libre',
      value: 'Miriam Libre',
    },
    {
      title: 'Mirza',
      value: 'Mirza',
    },
    {
      title: 'Miss Fajardose',
      value: 'Miss Fajardose',
    },
    {
      title: 'Mitr',
      value: 'Mitr',
    },
    {
      title: 'Mochiy Pop One',
      value: 'Mochiy Pop One',
    },
    {
      title: 'Mochiy Pop P One',
      value: 'Mochiy Pop P One',
    },
    {
      title: 'Modak',
      value: 'Modak',
    },
    {
      title: 'Modern Antiqua',
      value: 'Modern Antiqua',
    },
    {
      title: 'Mogra',
      value: 'Mogra',
    },
    {
      title: 'Mohave',
      value: 'Mohave',
    },
    {
      title: 'Moirai One',
      value: 'Moirai One',
    },
    {
      title: 'Molengo',
      value: 'Molengo',
    },
    {
      title: 'Molle',
      value: 'Molle',
    },
    {
      title: 'Monda',
      value: 'Monda',
    },
    {
      title: 'Monofett',
      value: 'Monofett',
    },
    {
      title: 'Monomaniac One',
      value: 'Monomaniac One',
    },
    {
      title: 'Monoton',
      value: 'Monoton',
    },
    {
      title: 'Monsieur La Doulaise',
      value: 'Monsieur La Doulaise',
    },
    {
      title: 'Montaga',
      value: 'Montaga',
    },
    {
      title: 'Montagu Slab',
      value: 'Montagu Slab',
    },
    {
      title: 'MonteCarlo',
      value: 'MonteCarlo',
    },
    {
      title: 'Montez',
      value: 'Montez',
    },
    {
      title: 'Montserrat',
      value: 'Montserrat',
    },
    {
      title: 'Montserrat Alternates',
      value: 'Montserrat Alternates',
    },
    {
      title: 'Montserrat Subrayada',
      value: 'Montserrat Subrayada',
    },
    {
      title: 'Moo Lah Lah',
      value: 'Moo Lah Lah',
    },
    {
      title: 'Mooli',
      value: 'Mooli',
    },
    {
      title: 'Moon Dance',
      value: 'Moon Dance',
    },
    {
      title: 'Moul',
      value: 'Moul',
    },
    {
      title: 'Moulpali',
      value: 'Moulpali',
    },
    {
      title: 'Mountains of Christmas',
      value: 'Mountains of Christmas',
    },
    {
      title: 'Mouse Memoirs',
      value: 'Mouse Memoirs',
    },
    {
      title: 'Mr Bedfort',
      value: 'Mr Bedfort',
    },
    {
      title: 'Mr Dafoe',
      value: 'Mr Dafoe',
    },
    {
      title: 'Mr De Haviland',
      value: 'Mr De Haviland',
    },
    {
      title: 'Mrs Saint Delafield',
      value: 'Mrs Saint Delafield',
    },
    {
      title: 'Mrs Sheppards',
      value: 'Mrs Sheppards',
    },
    {
      title: 'Ms Madi',
      value: 'Ms Madi',
    },
    {
      title: 'Mukta',
      value: 'Mukta',
    },
    {
      title: 'Mukta Mahee',
      value: 'Mukta Mahee',
    },
    {
      title: 'Mukta Malar',
      value: 'Mukta Malar',
    },
    {
      title: 'Mukta Vaani',
      value: 'Mukta Vaani',
    },
    {
      title: 'Mulish',
      value: 'Mulish',
    },
    {
      title: 'Murecho',
      value: 'Murecho',
    },
    {
      title: 'MuseoModerno',
      value: 'MuseoModerno',
    },
    {
      title: 'My Soul',
      value: 'My Soul',
    },
    {
      title: 'Mynerve',
      value: 'Mynerve',
    },
    {
      title: 'Mystery Quest',
      value: 'Mystery Quest',
    },
    {
      title: 'NTR',
      value: 'NTR',
    },
    {
      title: 'Nabla',
      value: 'Nabla',
    },
    {
      title: 'Namdhinggo',
      value: 'Namdhinggo',
    },
    {
      title: 'Nanum Brush Script',
      value: 'Nanum Brush Script',
    },
    {
      title: 'Nanum Gothic',
      value: 'Nanum Gothic',
    },
    {
      title: 'Nanum Gothic Coding',
      value: 'Nanum Gothic Coding',
    },
    {
      title: 'Nanum Myeongjo',
      value: 'Nanum Myeongjo',
    },
    {
      title: 'Nanum Pen Script',
      value: 'Nanum Pen Script',
    },
    {
      title: 'Narnoor',
      value: 'Narnoor',
    },
    {
      title: 'Neonderthaw',
      value: 'Neonderthaw',
    },
    {
      title: 'Nerko One',
      value: 'Nerko One',
    },
    {
      title: 'Neucha',
      value: 'Neucha',
    },
    {
      title: 'Neuton',
      value: 'Neuton',
    },
    {
      title: 'New Rocker',
      value: 'New Rocker',
    },
    {
      title: 'New Tegomin',
      value: 'New Tegomin',
    },
    {
      title: 'News Cycle',
      value: 'News Cycle',
    },
    {
      title: 'Newsreader',
      value: 'Newsreader',
    },
    {
      title: 'Niconne',
      value: 'Niconne',
    },
    {
      title: 'Niramit',
      value: 'Niramit',
    },
    {
      title: 'Nixie One',
      value: 'Nixie One',
    },
    {
      title: 'Nobile',
      value: 'Nobile',
    },
    {
      title: 'Nokora',
      value: 'Nokora',
    },
    {
      title: 'Norican',
      value: 'Norican',
    },
    {
      title: 'Nosifer',
      value: 'Nosifer',
    },
    {
      title: 'Notable',
      value: 'Notable',
    },
    {
      title: 'Nothing You Could Do',
      value: 'Nothing You Could Do',
    },
    {
      title: 'Noticia Text',
      value: 'Noticia Text',
    },
    {
      title: 'Noto Color Emoji',
      value: 'Noto Color Emoji',
    },
    {
      title: 'Noto Emoji',
      value: 'Noto Emoji',
    },
    {
      title: 'Noto Kufi Arabic',
      value: 'Noto Kufi Arabic',
    },
    {
      title: 'Noto Music',
      value: 'Noto Music',
    },
    {
      title: 'Noto Naskh Arabic',
      value: 'Noto Naskh Arabic',
    },
    {
      title: 'Noto Nastaliq Urdu',
      value: 'Noto Nastaliq Urdu',
    },
    {
      title: 'Noto Rashi Hebrew',
      value: 'Noto Rashi Hebrew',
    },
    {
      title: 'Noto Sans',
      value: 'Noto Sans',
    },
    {
      title: 'Noto Sans Adlam',
      value: 'Noto Sans Adlam',
    },
    {
      title: 'Noto Sans Adlam Unjoined',
      value: 'Noto Sans Adlam Unjoined',
    },
    {
      title: 'Noto Sans Anatolian Hieroglyphs',
      value: 'Noto Sans Anatolian Hieroglyphs',
    },
    {
      title: 'Noto Sans Arabic',
      value: 'Noto Sans Arabic',
    },
    {
      title: 'Noto Sans Armenian',
      value: 'Noto Sans Armenian',
    },
    {
      title: 'Noto Sans Avestan',
      value: 'Noto Sans Avestan',
    },
    {
      title: 'Noto Sans Balinese',
      value: 'Noto Sans Balinese',
    },
    {
      title: 'Noto Sans Bamum',
      value: 'Noto Sans Bamum',
    },
    {
      title: 'Noto Sans Bassa Vah',
      value: 'Noto Sans Bassa Vah',
    },
    {
      title: 'Noto Sans Batak',
      value: 'Noto Sans Batak',
    },
    {
      title: 'Noto Sans Bengali',
      value: 'Noto Sans Bengali',
    },
    {
      title: 'Noto Sans Bhaiksuki',
      value: 'Noto Sans Bhaiksuki',
    },
    {
      title: 'Noto Sans Brahmi',
      value: 'Noto Sans Brahmi',
    },
    {
      title: 'Noto Sans Buginese',
      value: 'Noto Sans Buginese',
    },
    {
      title: 'Noto Sans Buhid',
      value: 'Noto Sans Buhid',
    },
    {
      title: 'Noto Sans Canadian Aboriginal',
      value: 'Noto Sans Canadian Aboriginal',
    },
    {
      title: 'Noto Sans Carian',
      value: 'Noto Sans Carian',
    },
    {
      title: 'Noto Sans Caucasian Albanian',
      value: 'Noto Sans Caucasian Albanian',
    },
    {
      title: 'Noto Sans Chakma',
      value: 'Noto Sans Chakma',
    },
    {
      title: 'Noto Sans Cham',
      value: 'Noto Sans Cham',
    },
    {
      title: 'Noto Sans Cherokee',
      value: 'Noto Sans Cherokee',
    },
    {
      title: 'Noto Sans Chorasmian',
      value: 'Noto Sans Chorasmian',
    },
    {
      title: 'Noto Sans Coptic',
      value: 'Noto Sans Coptic',
    },
    {
      title: 'Noto Sans Cuneiform',
      value: 'Noto Sans Cuneiform',
    },
    {
      title: 'Noto Sans Cypriot',
      value: 'Noto Sans Cypriot',
    },
    {
      title: 'Noto Sans Cypro Minoan',
      value: 'Noto Sans Cypro Minoan',
    },
    {
      title: 'Noto Sans Deseret',
      value: 'Noto Sans Deseret',
    },
    {
      title: 'Noto Sans Devanagari',
      value: 'Noto Sans Devanagari',
    },
    {
      title: 'Noto Sans Display',
      value: 'Noto Sans Display',
    },
    {
      title: 'Noto Sans Duployan',
      value: 'Noto Sans Duployan',
    },
    {
      title: 'Noto Sans Egyptian Hieroglyphs',
      value: 'Noto Sans Egyptian Hieroglyphs',
    },
    {
      title: 'Noto Sans Elbasan',
      value: 'Noto Sans Elbasan',
    },
    {
      title: 'Noto Sans Elymaic',
      value: 'Noto Sans Elymaic',
    },
    {
      title: 'Noto Sans Ethiopic',
      value: 'Noto Sans Ethiopic',
    },
    {
      title: 'Noto Sans Georgian',
      value: 'Noto Sans Georgian',
    },
    {
      title: 'Noto Sans Glagolitic',
      value: 'Noto Sans Glagolitic',
    },
    {
      title: 'Noto Sans Gothic',
      value: 'Noto Sans Gothic',
    },
    {
      title: 'Noto Sans Grantha',
      value: 'Noto Sans Grantha',
    },
    {
      title: 'Noto Sans Gujarati',
      value: 'Noto Sans Gujarati',
    },
    {
      title: 'Noto Sans Gunjala Gondi',
      value: 'Noto Sans Gunjala Gondi',
    },
    {
      title: 'Noto Sans Gurmukhi',
      value: 'Noto Sans Gurmukhi',
    },
    {
      title: 'Noto Sans HK',
      value: 'Noto Sans HK',
    },
    {
      title: 'Noto Sans Hanifi Rohingya',
      value: 'Noto Sans Hanifi Rohingya',
    },
    {
      title: 'Noto Sans Hanunoo',
      value: 'Noto Sans Hanunoo',
    },
    {
      title: 'Noto Sans Hatran',
      value: 'Noto Sans Hatran',
    },
    {
      title: 'Noto Sans Hebrew',
      value: 'Noto Sans Hebrew',
    },
    {
      title: 'Noto Sans Imperial Aramaic',
      value: 'Noto Sans Imperial Aramaic',
    },
    {
      title: 'Noto Sans Indic Siyaq Numbers',
      value: 'Noto Sans Indic Siyaq Numbers',
    },
    {
      title: 'Noto Sans Inscriptional Pahlavi',
      value: 'Noto Sans Inscriptional Pahlavi',
    },
    {
      title: 'Noto Sans Inscriptional Parthian',
      value: 'Noto Sans Inscriptional Parthian',
    },
    {
      title: 'Noto Sans JP',
      value: 'Noto Sans JP',
    },
    {
      title: 'Noto Sans Javanese',
      value: 'Noto Sans Javanese',
    },
    {
      title: 'Noto Sans KR',
      value: 'Noto Sans KR',
    },
    {
      title: 'Noto Sans Kaithi',
      value: 'Noto Sans Kaithi',
    },
    {
      title: 'Noto Sans Kannada',
      value: 'Noto Sans Kannada',
    },
    {
      title: 'Noto Sans Kawi',
      value: 'Noto Sans Kawi',
    },
    {
      title: 'Noto Sans Kayah Li',
      value: 'Noto Sans Kayah Li',
    },
    {
      title: 'Noto Sans Kharoshthi',
      value: 'Noto Sans Kharoshthi',
    },
    {
      title: 'Noto Sans Khmer',
      value: 'Noto Sans Khmer',
    },
    {
      title: 'Noto Sans Khojki',
      value: 'Noto Sans Khojki',
    },
    {
      title: 'Noto Sans Khudawadi',
      value: 'Noto Sans Khudawadi',
    },
    {
      title: 'Noto Sans Lao',
      value: 'Noto Sans Lao',
    },
    {
      title: 'Noto Sans Lao Looped',
      value: 'Noto Sans Lao Looped',
    },
    {
      title: 'Noto Sans Lepcha',
      value: 'Noto Sans Lepcha',
    },
    {
      title: 'Noto Sans Limbu',
      value: 'Noto Sans Limbu',
    },
    {
      title: 'Noto Sans Linear A',
      value: 'Noto Sans Linear A',
    },
    {
      title: 'Noto Sans Linear B',
      value: 'Noto Sans Linear B',
    },
    {
      title: 'Noto Sans Lisu',
      value: 'Noto Sans Lisu',
    },
    {
      title: 'Noto Sans Lycian',
      value: 'Noto Sans Lycian',
    },
    {
      title: 'Noto Sans Lydian',
      value: 'Noto Sans Lydian',
    },
    {
      title: 'Noto Sans Mahajani',
      value: 'Noto Sans Mahajani',
    },
    {
      title: 'Noto Sans Malayalam',
      value: 'Noto Sans Malayalam',
    },
    {
      title: 'Noto Sans Mandaic',
      value: 'Noto Sans Mandaic',
    },
    {
      title: 'Noto Sans Manichaean',
      value: 'Noto Sans Manichaean',
    },
    {
      title: 'Noto Sans Marchen',
      value: 'Noto Sans Marchen',
    },
    {
      title: 'Noto Sans Masaram Gondi',
      value: 'Noto Sans Masaram Gondi',
    },
    {
      title: 'Noto Sans Math',
      value: 'Noto Sans Math',
    },
    {
      title: 'Noto Sans Mayan Numerals',
      value: 'Noto Sans Mayan Numerals',
    },
    {
      title: 'Noto Sans Medefaidrin',
      value: 'Noto Sans Medefaidrin',
    },
    {
      title: 'Noto Sans Meetei Mayek',
      value: 'Noto Sans Meetei Mayek',
    },
    {
      title: 'Noto Sans Mende Kikakui',
      value: 'Noto Sans Mende Kikakui',
    },
    {
      title: 'Noto Sans Meroitic',
      value: 'Noto Sans Meroitic',
    },
    {
      title: 'Noto Sans Miao',
      value: 'Noto Sans Miao',
    },
    {
      title: 'Noto Sans Modi',
      value: 'Noto Sans Modi',
    },
    {
      title: 'Noto Sans Mongolian',
      value: 'Noto Sans Mongolian',
    },
    {
      title: 'Noto Sans Mono',
      value: 'Noto Sans Mono',
    },
    {
      title: 'Noto Sans Mro',
      value: 'Noto Sans Mro',
    },
    {
      title: 'Noto Sans Multani',
      value: 'Noto Sans Multani',
    },
    {
      title: 'Noto Sans Myanmar',
      value: 'Noto Sans Myanmar',
    },
    {
      title: 'Noto Sans NKo',
      value: 'Noto Sans NKo',
    },
    {
      title: 'Noto Sans NKo Unjoined',
      value: 'Noto Sans NKo Unjoined',
    },
    {
      title: 'Noto Sans Nabataean',
      value: 'Noto Sans Nabataean',
    },
    {
      title: 'Noto Sans Nag Mundari',
      value: 'Noto Sans Nag Mundari',
    },
    {
      title: 'Noto Sans Nandinagari',
      value: 'Noto Sans Nandinagari',
    },
    {
      title: 'Noto Sans New Tai Lue',
      value: 'Noto Sans New Tai Lue',
    },
    {
      title: 'Noto Sans Newa',
      value: 'Noto Sans Newa',
    },
    {
      title: 'Noto Sans Nushu',
      value: 'Noto Sans Nushu',
    },
    {
      title: 'Noto Sans Ogham',
      value: 'Noto Sans Ogham',
    },
    {
      title: 'Noto Sans Ol Chiki',
      value: 'Noto Sans Ol Chiki',
    },
    {
      title: 'Noto Sans Old Hungarian',
      value: 'Noto Sans Old Hungarian',
    },
    {
      title: 'Noto Sans Old Italic',
      value: 'Noto Sans Old Italic',
    },
    {
      title: 'Noto Sans Old North Arabian',
      value: 'Noto Sans Old North Arabian',
    },
    {
      title: 'Noto Sans Old Permic',
      value: 'Noto Sans Old Permic',
    },
    {
      title: 'Noto Sans Old Persian',
      value: 'Noto Sans Old Persian',
    },
    {
      title: 'Noto Sans Old Sogdian',
      value: 'Noto Sans Old Sogdian',
    },
    {
      title: 'Noto Sans Old South Arabian',
      value: 'Noto Sans Old South Arabian',
    },
    {
      title: 'Noto Sans Old Turkic',
      value: 'Noto Sans Old Turkic',
    },
    {
      title: 'Noto Sans Oriya',
      value: 'Noto Sans Oriya',
    },
    {
      title: 'Noto Sans Osage',
      value: 'Noto Sans Osage',
    },
    {
      title: 'Noto Sans Osmanya',
      value: 'Noto Sans Osmanya',
    },
    {
      title: 'Noto Sans Pahawh Hmong',
      value: 'Noto Sans Pahawh Hmong',
    },
    {
      title: 'Noto Sans Palmyrene',
      value: 'Noto Sans Palmyrene',
    },
    {
      title: 'Noto Sans Pau Cin Hau',
      value: 'Noto Sans Pau Cin Hau',
    },
    {
      title: 'Noto Sans Phags Pa',
      value: 'Noto Sans Phags Pa',
    },
    {
      title: 'Noto Sans Phoenician',
      value: 'Noto Sans Phoenician',
    },
    {
      title: 'Noto Sans Psalter Pahlavi',
      value: 'Noto Sans Psalter Pahlavi',
    },
    {
      title: 'Noto Sans Rejang',
      value: 'Noto Sans Rejang',
    },
    {
      title: 'Noto Sans Runic',
      value: 'Noto Sans Runic',
    },
    {
      title: 'Noto Sans SC',
      value: 'Noto Sans SC',
    },
    {
      title: 'Noto Sans Samaritan',
      value: 'Noto Sans Samaritan',
    },
    {
      title: 'Noto Sans Saurashtra',
      value: 'Noto Sans Saurashtra',
    },
    {
      title: 'Noto Sans Sharada',
      value: 'Noto Sans Sharada',
    },
    {
      title: 'Noto Sans Shavian',
      value: 'Noto Sans Shavian',
    },
    {
      title: 'Noto Sans Siddham',
      value: 'Noto Sans Siddham',
    },
    {
      title: 'Noto Sans SignWriting',
      value: 'Noto Sans SignWriting',
    },
    {
      title: 'Noto Sans Sinhala',
      value: 'Noto Sans Sinhala',
    },
    {
      title: 'Noto Sans Sogdian',
      value: 'Noto Sans Sogdian',
    },
    {
      title: 'Noto Sans Sora Sompeng',
      value: 'Noto Sans Sora Sompeng',
    },
    {
      title: 'Noto Sans Soyombo',
      value: 'Noto Sans Soyombo',
    },
    {
      title: 'Noto Sans Sundanese',
      value: 'Noto Sans Sundanese',
    },
    {
      title: 'Noto Sans Syloti Nagri',
      value: 'Noto Sans Syloti Nagri',
    },
    {
      title: 'Noto Sans Symbols',
      value: 'Noto Sans Symbols',
    },
    {
      title: 'Noto Sans Symbols 2',
      value: 'Noto Sans Symbols 2',
    },
    {
      title: 'Noto Sans Syriac',
      value: 'Noto Sans Syriac',
    },
    {
      title: 'Noto Sans Syriac Eastern',
      value: 'Noto Sans Syriac Eastern',
    },
    {
      title: 'Noto Sans TC',
      value: 'Noto Sans TC',
    },
    {
      title: 'Noto Sans Tagalog',
      value: 'Noto Sans Tagalog',
    },
    {
      title: 'Noto Sans Tagbanwa',
      value: 'Noto Sans Tagbanwa',
    },
    {
      title: 'Noto Sans Tai Le',
      value: 'Noto Sans Tai Le',
    },
    {
      title: 'Noto Sans Tai Tham',
      value: 'Noto Sans Tai Tham',
    },
    {
      title: 'Noto Sans Tai Viet',
      value: 'Noto Sans Tai Viet',
    },
    {
      title: 'Noto Sans Takri',
      value: 'Noto Sans Takri',
    },
    {
      title: 'Noto Sans Tamil',
      value: 'Noto Sans Tamil',
    },
    {
      title: 'Noto Sans Tamil Supplement',
      value: 'Noto Sans Tamil Supplement',
    },
    {
      title: 'Noto Sans Tangsa',
      value: 'Noto Sans Tangsa',
    },
    {
      title: 'Noto Sans Telugu',
      value: 'Noto Sans Telugu',
    },
    {
      title: 'Noto Sans Thaana',
      value: 'Noto Sans Thaana',
    },
    {
      title: 'Noto Sans Thai',
      value: 'Noto Sans Thai',
    },
    {
      title: 'Noto Sans Thai Looped',
      value: 'Noto Sans Thai Looped',
    },
    {
      title: 'Noto Sans Tifinagh',
      value: 'Noto Sans Tifinagh',
    },
    {
      title: 'Noto Sans Tirhuta',
      value: 'Noto Sans Tirhuta',
    },
    {
      title: 'Noto Sans Ugaritic',
      value: 'Noto Sans Ugaritic',
    },
    {
      title: 'Noto Sans Vai',
      value: 'Noto Sans Vai',
    },
    {
      title: 'Noto Sans Vithkuqi',
      value: 'Noto Sans Vithkuqi',
    },
    {
      title: 'Noto Sans Wancho',
      value: 'Noto Sans Wancho',
    },
    {
      title: 'Noto Sans Warang Citi',
      value: 'Noto Sans Warang Citi',
    },
    {
      title: 'Noto Sans Yi',
      value: 'Noto Sans Yi',
    },
    {
      title: 'Noto Sans Zanabazar Square',
      value: 'Noto Sans Zanabazar Square',
    },
    {
      title: 'Noto Serif',
      value: 'Noto Serif',
    },
    {
      title: 'Noto Serif Ahom',
      value: 'Noto Serif Ahom',
    },
    {
      title: 'Noto Serif Armenian',
      value: 'Noto Serif Armenian',
    },
    {
      title: 'Noto Serif Balinese',
      value: 'Noto Serif Balinese',
    },
    {
      title: 'Noto Serif Bengali',
      value: 'Noto Serif Bengali',
    },
    {
      title: 'Noto Serif Devanagari',
      value: 'Noto Serif Devanagari',
    },
    {
      title: 'Noto Serif Display',
      value: 'Noto Serif Display',
    },
    {
      title: 'Noto Serif Dogra',
      value: 'Noto Serif Dogra',
    },
    {
      title: 'Noto Serif Ethiopic',
      value: 'Noto Serif Ethiopic',
    },
    {
      title: 'Noto Serif Georgian',
      value: 'Noto Serif Georgian',
    },
    {
      title: 'Noto Serif Grantha',
      value: 'Noto Serif Grantha',
    },
    {
      title: 'Noto Serif Gujarati',
      value: 'Noto Serif Gujarati',
    },
    {
      title: 'Noto Serif Gurmukhi',
      value: 'Noto Serif Gurmukhi',
    },
    {
      title: 'Noto Serif HK',
      value: 'Noto Serif HK',
    },
    {
      title: 'Noto Serif Hebrew',
      value: 'Noto Serif Hebrew',
    },
    {
      title: 'Noto Serif JP',
      value: 'Noto Serif JP',
    },
    {
      title: 'Noto Serif KR',
      value: 'Noto Serif KR',
    },
    {
      title: 'Noto Serif Kannada',
      value: 'Noto Serif Kannada',
    },
    {
      title: 'Noto Serif Khitan Small Script',
      value: 'Noto Serif Khitan Small Script',
    },
    {
      title: 'Noto Serif Khmer',
      value: 'Noto Serif Khmer',
    },
    {
      title: 'Noto Serif Khojki',
      value: 'Noto Serif Khojki',
    },
    {
      title: 'Noto Serif Lao',
      value: 'Noto Serif Lao',
    },
    {
      title: 'Noto Serif Makasar',
      value: 'Noto Serif Makasar',
    },
    {
      title: 'Noto Serif Malayalam',
      value: 'Noto Serif Malayalam',
    },
    {
      title: 'Noto Serif Myanmar',
      value: 'Noto Serif Myanmar',
    },
    {
      title: 'Noto Serif NP Hmong',
      value: 'Noto Serif NP Hmong',
    },
    {
      title: 'Noto Serif Old Uyghur',
      value: 'Noto Serif Old Uyghur',
    },
    {
      title: 'Noto Serif Oriya',
      value: 'Noto Serif Oriya',
    },
    {
      title: 'Noto Serif Ottoman Siyaq',
      value: 'Noto Serif Ottoman Siyaq',
    },
    {
      title: 'Noto Serif SC',
      value: 'Noto Serif SC',
    },
    {
      title: 'Noto Serif Sinhala',
      value: 'Noto Serif Sinhala',
    },
    {
      title: 'Noto Serif TC',
      value: 'Noto Serif TC',
    },
    {
      title: 'Noto Serif Tamil',
      value: 'Noto Serif Tamil',
    },
    {
      title: 'Noto Serif Tangut',
      value: 'Noto Serif Tangut',
    },
    {
      title: 'Noto Serif Telugu',
      value: 'Noto Serif Telugu',
    },
    {
      title: 'Noto Serif Thai',
      value: 'Noto Serif Thai',
    },
    {
      title: 'Noto Serif Tibetan',
      value: 'Noto Serif Tibetan',
    },
    {
      title: 'Noto Serif Toto',
      value: 'Noto Serif Toto',
    },
    {
      title: 'Noto Serif Vithkuqi',
      value: 'Noto Serif Vithkuqi',
    },
    {
      title: 'Noto Serif Yezidi',
      value: 'Noto Serif Yezidi',
    },
    {
      title: 'Noto Traditional Nushu',
      value: 'Noto Traditional Nushu',
    },
    {
      title: 'Noto Znamenny Musical Notation',
      value: 'Noto Znamenny Musical Notation',
    },
    {
      title: 'Nova Cut',
      value: 'Nova Cut',
    },
    {
      title: 'Nova Flat',
      value: 'Nova Flat',
    },
    {
      title: 'Nova Mono',
      value: 'Nova Mono',
    },
    {
      title: 'Nova Oval',
      value: 'Nova Oval',
    },
    {
      title: 'Nova Round',
      value: 'Nova Round',
    },
    {
      title: 'Nova Script',
      value: 'Nova Script',
    },
    {
      title: 'Nova Slim',
      value: 'Nova Slim',
    },
    {
      title: 'Nova Square',
      value: 'Nova Square',
    },
    {
      title: 'Numans',
      value: 'Numans',
    },
    {
      title: 'Nunito',
      value: 'Nunito',
    },
    {
      title: 'Nunito Sans',
      value: 'Nunito Sans',
    },
    {
      title: 'Nuosu SIL',
      value: 'Nuosu SIL',
    },
    {
      title: 'Odibee Sans',
      value: 'Odibee Sans',
    },
    {
      title: 'Odor Mean Chey',
      value: 'Odor Mean Chey',
    },
    {
      title: 'Offside',
      value: 'Offside',
    },
    {
      title: 'Oi',
      value: 'Oi',
    },
    {
      title: 'Ojuju',
      value: 'Ojuju',
    },
    {
      title: 'Old Standard TT',
      value: 'Old Standard TT',
    },
    {
      title: 'Oldenburg',
      value: 'Oldenburg',
    },
    {
      title: 'Ole',
      value: 'Ole',
    },
    {
      title: 'Oleo Script',
      value: 'Oleo Script',
    },
    {
      title: 'Oleo Script Swash Caps',
      value: 'Oleo Script Swash Caps',
    },
    {
      title: 'Onest',
      value: 'Onest',
    },
    {
      title: 'Oooh Baby',
      value: 'Oooh Baby',
    },
    {
      title: 'Open Sans',
      value: 'Open Sans',
    },
    {
      title: 'Oranienbaum',
      value: 'Oranienbaum',
    },
    {
      title: 'Orbit',
      value: 'Orbit',
    },
    {
      title: 'Orbitron',
      value: 'Orbitron',
    },
    {
      title: 'Oregano',
      value: 'Oregano',
    },
    {
      title: 'Orelega One',
      value: 'Orelega One',
    },
    {
      title: 'Orienta',
      value: 'Orienta',
    },
    {
      title: 'Original Surfer',
      value: 'Original Surfer',
    },
    {
      title: 'Oswald',
      value: 'Oswald',
    },
    {
      title: 'Outfit',
      value: 'Outfit',
    },
    {
      title: 'Over the Rainbow',
      value: 'Over the Rainbow',
    },
    {
      title: 'Overlock',
      value: 'Overlock',
    },
    {
      title: 'Overlock SC',
      value: 'Overlock SC',
    },
    {
      title: 'Overpass',
      value: 'Overpass',
    },
    {
      title: 'Overpass Mono',
      value: 'Overpass Mono',
    },
    {
      title: 'Ovo',
      value: 'Ovo',
    },
    {
      title: 'Oxanium',
      value: 'Oxanium',
    },
    {
      title: 'Oxygen',
      value: 'Oxygen',
    },
    {
      title: 'Oxygen Mono',
      value: 'Oxygen Mono',
    },
    {
      title: 'PT Mono',
      value: 'PT Mono',
    },
    {
      title: 'PT Sans',
      value: 'PT Sans',
    },
    {
      title: 'PT Sans Caption',
      value: 'PT Sans Caption',
    },
    {
      title: 'PT Sans Narrow',
      value: 'PT Sans Narrow',
    },
    {
      title: 'PT Serif',
      value: 'PT Serif',
    },
    {
      title: 'PT Serif Caption',
      value: 'PT Serif Caption',
    },
    {
      title: 'Pacifico',
      value: 'Pacifico',
    },
    {
      title: 'Padauk',
      value: 'Padauk',
    },
    {
      title: 'Padyakke Expanded One',
      value: 'Padyakke Expanded One',
    },
    {
      title: 'Palanquin',
      value: 'Palanquin',
    },
    {
      title: 'Palanquin Dark',
      value: 'Palanquin Dark',
    },
    {
      title: 'Palette Mosaic',
      value: 'Palette Mosaic',
    },
    {
      title: 'Pangolin',
      value: 'Pangolin',
    },
    {
      title: 'Paprika',
      value: 'Paprika',
    },
    {
      title: 'Parisienne',
      value: 'Parisienne',
    },
    {
      title: 'Passero One',
      value: 'Passero One',
    },
    {
      title: 'Passion One',
      value: 'Passion One',
    },
    {
      title: 'Passions Conflict',
      value: 'Passions Conflict',
    },
    {
      title: 'Pathway Extreme',
      value: 'Pathway Extreme',
    },
    {
      title: 'Pathway Gothic One',
      value: 'Pathway Gothic One',
    },
    {
      title: 'Patrick Hand',
      value: 'Patrick Hand',
    },
    {
      title: 'Patrick Hand SC',
      value: 'Patrick Hand SC',
    },
    {
      title: 'Pattaya',
      value: 'Pattaya',
    },
    {
      title: 'Patua One',
      value: 'Patua One',
    },
    {
      title: 'Pavanam',
      value: 'Pavanam',
    },
    {
      title: 'Paytone One',
      value: 'Paytone One',
    },
    {
      title: 'Peddana',
      value: 'Peddana',
    },
    {
      title: 'Peralta',
      value: 'Peralta',
    },
    {
      title: 'Permanent Marker',
      value: 'Permanent Marker',
    },
    {
      title: 'Petemoss',
      value: 'Petemoss',
    },
    {
      title: 'Petit Formal Script',
      value: 'Petit Formal Script',
    },
    {
      title: 'Petrona',
      value: 'Petrona',
    },
    {
      title: 'Philosopher',
      value: 'Philosopher',
    },
    {
      title: 'Phudu',
      value: 'Phudu',
    },
    {
      title: 'Piazzolla',
      value: 'Piazzolla',
    },
    {
      title: 'Piedra',
      value: 'Piedra',
    },
    {
      title: 'Pinyon Script',
      value: 'Pinyon Script',
    },
    {
      title: 'Pirata One',
      value: 'Pirata One',
    },
    {
      title: 'Pixelify Sans',
      value: 'Pixelify Sans',
    },
    {
      title: 'Plaster',
      value: 'Plaster',
    },
    {
      title: 'Platypi',
      value: 'Platypi',
    },
    {
      title: 'Play',
      value: 'Play',
    },
    {
      title: 'Playball',
      value: 'Playball',
    },
    {
      title: 'Playfair',
      value: 'Playfair',
    },
    {
      title: 'Playfair Display',
      value: 'Playfair Display',
    },
    {
      title: 'Playfair Display SC',
      value: 'Playfair Display SC',
    },
    {
      title: 'Playpen Sans',
      value: 'Playpen Sans',
    },
    {
      title: 'Playwrite AR',
      value: 'Playwrite AR',
    },
    {
      title: 'Playwrite AT',
      value: 'Playwrite AT',
    },
    {
      title: 'Playwrite AU NSW',
      value: 'Playwrite AU NSW',
    },
    {
      title: 'Playwrite AU QLD',
      value: 'Playwrite AU QLD',
    },
    {
      title: 'Playwrite AU SA',
      value: 'Playwrite AU SA',
    },
    {
      title: 'Playwrite AU TAS',
      value: 'Playwrite AU TAS',
    },
    {
      title: 'Playwrite AU VIC',
      value: 'Playwrite AU VIC',
    },
    {
      title: 'Playwrite BE VLG',
      value: 'Playwrite BE VLG',
    },
    {
      title: 'Playwrite BE WAL',
      value: 'Playwrite BE WAL',
    },
    {
      title: 'Playwrite BR',
      value: 'Playwrite BR',
    },
    {
      title: 'Playwrite CA',
      value: 'Playwrite CA',
    },
    {
      title: 'Playwrite CL',
      value: 'Playwrite CL',
    },
    {
      title: 'Playwrite CO',
      value: 'Playwrite CO',
    },
    {
      title: 'Playwrite CU',
      value: 'Playwrite CU',
    },
    {
      title: 'Playwrite CZ',
      value: 'Playwrite CZ',
    },
    {
      title: 'Playwrite DE Grund',
      value: 'Playwrite DE Grund',
    },
    {
      title: 'Playwrite DE LA',
      value: 'Playwrite DE LA',
    },
    {
      title: 'Playwrite DE SAS',
      value: 'Playwrite DE SAS',
    },
    {
      title: 'Playwrite DE VA',
      value: 'Playwrite DE VA',
    },
    {
      title: 'Playwrite DK Loopet',
      value: 'Playwrite DK Loopet',
    },
    {
      title: 'Playwrite DK Uloopet',
      value: 'Playwrite DK Uloopet',
    },
    {
      title: 'Playwrite ES',
      value: 'Playwrite ES',
    },
    {
      title: 'Playwrite ES Deco',
      value: 'Playwrite ES Deco',
    },
    {
      title: 'Playwrite FR Moderne',
      value: 'Playwrite FR Moderne',
    },
    {
      title: 'Playwrite FR Trad',
      value: 'Playwrite FR Trad',
    },
    {
      title: 'Playwrite GB J',
      value: 'Playwrite GB J',
    },
    {
      title: 'Playwrite GB S',
      value: 'Playwrite GB S',
    },
    {
      title: 'Playwrite HR',
      value: 'Playwrite HR',
    },
    {
      title: 'Playwrite HR Lijeva',
      value: 'Playwrite HR Lijeva',
    },
    {
      title: 'Playwrite HU',
      value: 'Playwrite HU',
    },
    {
      title: 'Playwrite ID',
      value: 'Playwrite ID',
    },
    {
      title: 'Playwrite IE',
      value: 'Playwrite IE',
    },
    {
      title: 'Playwrite IN',
      value: 'Playwrite IN',
    },
    {
      title: 'Playwrite IS',
      value: 'Playwrite IS',
    },
    {
      title: 'Playwrite IT Moderna',
      value: 'Playwrite IT Moderna',
    },
    {
      title: 'Playwrite IT Trad',
      value: 'Playwrite IT Trad',
    },
    {
      title: 'Playwrite MX',
      value: 'Playwrite MX',
    },
    {
      title: 'Playwrite NG Modern',
      value: 'Playwrite NG Modern',
    },
    {
      title: 'Playwrite NL',
      value: 'Playwrite NL',
    },
    {
      title: 'Playwrite NO',
      value: 'Playwrite NO',
    },
    {
      title: 'Playwrite NZ',
      value: 'Playwrite NZ',
    },
    {
      title: 'Playwrite PE',
      value: 'Playwrite PE',
    },
    {
      title: 'Playwrite PL',
      value: 'Playwrite PL',
    },
    {
      title: 'Playwrite PT',
      value: 'Playwrite PT',
    },
    {
      title: 'Playwrite RO',
      value: 'Playwrite RO',
    },
    {
      title: 'Playwrite SK',
      value: 'Playwrite SK',
    },
    {
      title: 'Playwrite TZ',
      value: 'Playwrite TZ',
    },
    {
      title: 'Playwrite US Modern',
      value: 'Playwrite US Modern',
    },
    {
      title: 'Playwrite US Trad',
      value: 'Playwrite US Trad',
    },
    {
      title: 'Playwrite VN',
      value: 'Playwrite VN',
    },
    {
      title: 'Playwrite ZA',
      value: 'Playwrite ZA',
    },
    {
      title: 'Plus Jakarta Sans',
      value: 'Plus Jakarta Sans',
    },
    {
      title: 'Podkova',
      value: 'Podkova',
    },
    {
      title: 'Poetsen One',
      value: 'Poetsen One',
    },
    {
      title: 'Poiret One',
      value: 'Poiret One',
    },
    {
      title: 'Poller One',
      value: 'Poller One',
    },
    {
      title: 'Poltawski Nowy',
      value: 'Poltawski Nowy',
    },
    {
      title: 'Poly',
      value: 'Poly',
    },
    {
      title: 'Pompiere',
      value: 'Pompiere',
    },
    {
      title: 'Pontano Sans',
      value: 'Pontano Sans',
    },
    {
      title: 'Poor Story',
      value: 'Poor Story',
    },
    {
      title: 'Poppins',
      value: 'Poppins',
    },
    {
      title: 'Port Lligat Sans',
      value: 'Port Lligat Sans',
    },
    {
      title: 'Port Lligat Slab',
      value: 'Port Lligat Slab',
    },
    {
      title: 'Potta One',
      value: 'Potta One',
    },
    {
      title: 'Pragati Narrow',
      value: 'Pragati Narrow',
    },
    {
      title: 'Praise',
      value: 'Praise',
    },
    {
      title: 'Prata',
      value: 'Prata',
    },
    {
      title: 'Preahvihear',
      value: 'Preahvihear',
    },
    {
      title: 'Press Start 2P',
      value: 'Press Start 2P',
    },
    {
      title: 'Pridi',
      value: 'Pridi',
    },
    {
      title: 'Princess Sofia',
      value: 'Princess Sofia',
    },
    {
      title: 'Prociono',
      value: 'Prociono',
    },
    {
      title: 'Prompt',
      value: 'Prompt',
    },
    {
      title: 'Prosto One',
      value: 'Prosto One',
    },
    {
      title: 'Protest Guerrilla',
      value: 'Protest Guerrilla',
    },
    {
      title: 'Protest Revolution',
      value: 'Protest Revolution',
    },
    {
      title: 'Protest Riot',
      value: 'Protest Riot',
    },
    {
      title: 'Protest Strike',
      value: 'Protest Strike',
    },
    {
      title: 'Proza Libre',
      value: 'Proza Libre',
    },
    {
      title: 'Public Sans',
      value: 'Public Sans',
    },
    {
      title: 'Puppies Play',
      value: 'Puppies Play',
    },
    {
      title: 'Puritan',
      value: 'Puritan',
    },
    {
      title: 'Purple Purse',
      value: 'Purple Purse',
    },
    {
      title: 'Qahiri',
      value: 'Qahiri',
    },
    {
      title: 'Quando',
      value: 'Quando',
    },
    {
      title: 'Quantico',
      value: 'Quantico',
    },
    {
      title: 'Quattrocento',
      value: 'Quattrocento',
    },
    {
      title: 'Quattrocento Sans',
      value: 'Quattrocento Sans',
    },
    {
      title: 'Questrial',
      value: 'Questrial',
    },
    {
      title: 'Quicksand',
      value: 'Quicksand',
    },
    {
      title: 'Quintessential',
      value: 'Quintessential',
    },
    {
      title: 'Qwigley',
      value: 'Qwigley',
    },
    {
      title: 'Qwitcher Grypen',
      value: 'Qwitcher Grypen',
    },
    {
      title: 'REM',
      value: 'REM',
    },
    {
      title: 'Racing Sans One',
      value: 'Racing Sans One',
    },
    {
      title: 'Radio Canada',
      value: 'Radio Canada',
    },
    {
      title: 'Radio Canada Big',
      value: 'Radio Canada Big',
    },
    {
      title: 'Radley',
      value: 'Radley',
    },
    {
      title: 'Rajdhani',
      value: 'Rajdhani',
    },
    {
      title: 'Rakkas',
      value: 'Rakkas',
    },
    {
      title: 'Raleway',
      value: 'Raleway',
    },
    {
      title: 'Raleway Dots',
      value: 'Raleway Dots',
    },
    {
      title: 'Ramabhadra',
      value: 'Ramabhadra',
    },
    {
      title: 'Ramaraja',
      value: 'Ramaraja',
    },
    {
      title: 'Rambla',
      value: 'Rambla',
    },
    {
      title: 'Rammetto One',
      value: 'Rammetto One',
    },
    {
      title: 'Rampart One',
      value: 'Rampart One',
    },
    {
      title: 'Ranchers',
      value: 'Ranchers',
    },
    {
      title: 'Rancho',
      value: 'Rancho',
    },
    {
      title: 'Ranga',
      value: 'Ranga',
    },
    {
      title: 'Rasa',
      value: 'Rasa',
    },
    {
      title: 'Rationale',
      value: 'Rationale',
    },
    {
      title: 'Ravi Prakash',
      value: 'Ravi Prakash',
    },
    {
      title: 'Readex Pro',
      value: 'Readex Pro',
    },
    {
      title: 'Recursive',
      value: 'Recursive',
    },
    {
      title: 'Red Hat Display',
      value: 'Red Hat Display',
    },
    {
      title: 'Red Hat Mono',
      value: 'Red Hat Mono',
    },
    {
      title: 'Red Hat Text',
      value: 'Red Hat Text',
    },
    {
      title: 'Red Rose',
      value: 'Red Rose',
    },
    {
      title: 'Redacted',
      value: 'Redacted',
    },
    {
      title: 'Redacted Script',
      value: 'Redacted Script',
    },
    {
      title: 'Reddit Mono',
      value: 'Reddit Mono',
    },
    {
      title: 'Reddit Sans',
      value: 'Reddit Sans',
    },
    {
      title: 'Reddit Sans Condensed',
      value: 'Reddit Sans Condensed',
    },
    {
      title: 'Redressed',
      value: 'Redressed',
    },
    {
      title: 'Reem Kufi',
      value: 'Reem Kufi',
    },
    {
      title: 'Reem Kufi Fun',
      value: 'Reem Kufi Fun',
    },
    {
      title: 'Reem Kufi Ink',
      value: 'Reem Kufi Ink',
    },
    {
      title: 'Reenie Beanie',
      value: 'Reenie Beanie',
    },
    {
      title: 'Reggae One',
      value: 'Reggae One',
    },
    {
      title: 'Rethink Sans',
      value: 'Rethink Sans',
    },
    {
      title: 'Revalia',
      value: 'Revalia',
    },
    {
      title: 'Rhodium Libre',
      value: 'Rhodium Libre',
    },
    {
      title: 'Ribeye',
      value: 'Ribeye',
    },
    {
      title: 'Ribeye Marrow',
      value: 'Ribeye Marrow',
    },
    {
      title: 'Righteous',
      value: 'Righteous',
    },
    {
      title: 'Risque',
      value: 'Risque',
    },
    {
      title: 'Road Rage',
      value: 'Road Rage',
    },
    {
      title: 'Roboto',
      value: 'Roboto',
    },
    {
      title: 'Roboto Condensed',
      value: 'Roboto Condensed',
    },
    {
      title: 'Roboto Flex',
      value: 'Roboto Flex',
    },
    {
      title: 'Roboto Mono',
      value: 'Roboto Mono',
    },
    {
      title: 'Roboto Serif',
      value: 'Roboto Serif',
    },
    {
      title: 'Roboto Slab',
      value: 'Roboto Slab',
    },
    {
      title: 'Rochester',
      value: 'Rochester',
    },
    {
      title: 'Rock 3D',
      value: 'Rock 3D',
    },
    {
      title: 'Rock Salt',
      value: 'Rock Salt',
    },
    {
      title: 'RocknRoll One',
      value: 'RocknRoll One',
    },
    {
      title: 'Rokkitt',
      value: 'Rokkitt',
    },
    {
      title: 'Romanesco',
      value: 'Romanesco',
    },
    {
      title: 'Ropa Sans',
      value: 'Ropa Sans',
    },
    {
      title: 'Rosario',
      value: 'Rosario',
    },
    {
      title: 'Rosarivo',
      value: 'Rosarivo',
    },
    {
      title: 'Rouge Script',
      value: 'Rouge Script',
    },
    {
      title: 'Rowdies',
      value: 'Rowdies',
    },
    {
      title: 'Rozha One',
      value: 'Rozha One',
    },
    {
      title: 'Rubik',
      value: 'Rubik',
    },
    {
      title: 'Rubik 80s Fade',
      value: 'Rubik 80s Fade',
    },
    {
      title: 'Rubik Beastly',
      value: 'Rubik Beastly',
    },
    {
      title: 'Rubik Broken Fax',
      value: 'Rubik Broken Fax',
    },
    {
      title: 'Rubik Bubbles',
      value: 'Rubik Bubbles',
    },
    {
      title: 'Rubik Burned',
      value: 'Rubik Burned',
    },
    {
      title: 'Rubik Dirt',
      value: 'Rubik Dirt',
    },
    {
      title: 'Rubik Distressed',
      value: 'Rubik Distressed',
    },
    {
      title: 'Rubik Doodle Shadow',
      value: 'Rubik Doodle Shadow',
    },
    {
      title: 'Rubik Doodle Triangles',
      value: 'Rubik Doodle Triangles',
    },
    {
      title: 'Rubik Gemstones',
      value: 'Rubik Gemstones',
    },
    {
      title: 'Rubik Glitch',
      value: 'Rubik Glitch',
    },
    {
      title: 'Rubik Glitch Pop',
      value: 'Rubik Glitch Pop',
    },
    {
      title: 'Rubik Iso',
      value: 'Rubik Iso',
    },
    {
      title: 'Rubik Lines',
      value: 'Rubik Lines',
    },
    {
      title: 'Rubik Maps',
      value: 'Rubik Maps',
    },
    {
      title: 'Rubik Marker Hatch',
      value: 'Rubik Marker Hatch',
    },
    {
      title: 'Rubik Maze',
      value: 'Rubik Maze',
    },
    {
      title: 'Rubik Microbe',
      value: 'Rubik Microbe',
    },
    {
      title: 'Rubik Mono One',
      value: 'Rubik Mono One',
    },
    {
      title: 'Rubik Moonrocks',
      value: 'Rubik Moonrocks',
    },
    {
      title: 'Rubik Pixels',
      value: 'Rubik Pixels',
    },
    {
      title: 'Rubik Puddles',
      value: 'Rubik Puddles',
    },
    {
      title: 'Rubik Scribble',
      value: 'Rubik Scribble',
    },
    {
      title: 'Rubik Spray Paint',
      value: 'Rubik Spray Paint',
    },
    {
      title: 'Rubik Storm',
      value: 'Rubik Storm',
    },
    {
      title: 'Rubik Vinyl',
      value: 'Rubik Vinyl',
    },
    {
      title: 'Rubik Wet Paint',
      value: 'Rubik Wet Paint',
    },
    {
      title: 'Ruda',
      value: 'Ruda',
    },
    {
      title: 'Rufina',
      value: 'Rufina',
    },
    {
      title: 'Ruge Boogie',
      value: 'Ruge Boogie',
    },
    {
      title: 'Ruluko',
      value: 'Ruluko',
    },
    {
      title: 'Rum Raisin',
      value: 'Rum Raisin',
    },
    {
      title: 'Ruslan Display',
      value: 'Ruslan Display',
    },
    {
      title: 'Russo One',
      value: 'Russo One',
    },
    {
      title: 'Ruthie',
      value: 'Ruthie',
    },
    {
      title: 'Ruwudu',
      value: 'Ruwudu',
    },
    {
      title: 'Rye',
      value: 'Rye',
    },
    {
      title: 'STIX Two Text',
      value: 'STIX Two Text',
    },
    {
      title: 'Sacramento',
      value: 'Sacramento',
    },
    {
      title: 'Sahitya',
      value: 'Sahitya',
    },
    {
      title: 'Sail',
      value: 'Sail',
    },
    {
      title: 'Saira',
      value: 'Saira',
    },
    {
      title: 'Saira Condensed',
      value: 'Saira Condensed',
    },
    {
      title: 'Saira Extra Condensed',
      value: 'Saira Extra Condensed',
    },
    {
      title: 'Saira Semi Condensed',
      value: 'Saira Semi Condensed',
    },
    {
      title: 'Saira Stencil One',
      value: 'Saira Stencil One',
    },
    {
      title: 'Salsa',
      value: 'Salsa',
    },
    {
      title: 'Sanchez',
      value: 'Sanchez',
    },
    {
      title: 'Sancreek',
      value: 'Sancreek',
    },
    {
      title: 'Sankofa Display',
      value: 'Sankofa Display',
    },
    {
      title: 'Sansita',
      value: 'Sansita',
    },
    {
      title: 'Sansita Swashed',
      value: 'Sansita Swashed',
    },
    {
      title: 'Sarabun',
      value: 'Sarabun',
    },
    {
      title: 'Sarala',
      value: 'Sarala',
    },
    {
      title: 'Sarina',
      value: 'Sarina',
    },
    {
      title: 'Sarpanch',
      value: 'Sarpanch',
    },
    {
      title: 'Sassy Frass',
      value: 'Sassy Frass',
    },
    {
      title: 'Satisfy',
      value: 'Satisfy',
    },
    {
      title: 'Sawarabi Gothic',
      value: 'Sawarabi Gothic',
    },
    {
      title: 'Sawarabi Mincho',
      value: 'Sawarabi Mincho',
    },
    {
      title: 'Scada',
      value: 'Scada',
    },
    {
      title: 'Scheherazade New',
      value: 'Scheherazade New',
    },
    {
      title: 'Schibsted Grotesk',
      value: 'Schibsted Grotesk',
    },
    {
      title: 'Schoolbell',
      value: 'Schoolbell',
    },
    {
      title: 'Scope One',
      value: 'Scope One',
    },
    {
      title: 'Seaweed Script',
      value: 'Seaweed Script',
    },
    {
      title: 'Secular One',
      value: 'Secular One',
    },
    {
      title: 'Sedan',
      value: 'Sedan',
    },
    {
      title: 'Sedan SC',
      value: 'Sedan SC',
    },
    {
      title: 'Sedgwick Ave',
      value: 'Sedgwick Ave',
    },
    {
      title: 'Sedgwick Ave Display',
      value: 'Sedgwick Ave Display',
    },
    {
      title: 'Sen',
      value: 'Sen',
    },
    {
      title: 'Send Flowers',
      value: 'Send Flowers',
    },
    {
      title: 'Sevillana',
      value: 'Sevillana',
    },
    {
      title: 'Seymour One',
      value: 'Seymour One',
    },
    {
      title: 'Shadows Into Light',
      value: 'Shadows Into Light',
    },
    {
      title: 'Shadows Into Light Two',
      value: 'Shadows Into Light Two',
    },
    {
      title: 'Shalimar',
      value: 'Shalimar',
    },
    {
      title: 'Shantell Sans',
      value: 'Shantell Sans',
    },
    {
      title: 'Shanti',
      value: 'Shanti',
    },
    {
      title: 'Share',
      value: 'Share',
    },
    {
      title: 'Share Tech',
      value: 'Share Tech',
    },
    {
      title: 'Share Tech Mono',
      value: 'Share Tech Mono',
    },
    {
      title: 'Shippori Antique',
      value: 'Shippori Antique',
    },
    {
      title: 'Shippori Antique B1',
      value: 'Shippori Antique B1',
    },
    {
      title: 'Shippori Mincho',
      value: 'Shippori Mincho',
    },
    {
      title: 'Shippori Mincho B1',
      value: 'Shippori Mincho B1',
    },
    {
      title: 'Shizuru',
      value: 'Shizuru',
    },
    {
      title: 'Shojumaru',
      value: 'Shojumaru',
    },
    {
      title: 'Short Stack',
      value: 'Short Stack',
    },
    {
      title: 'Shrikhand',
      value: 'Shrikhand',
    },
    {
      title: 'Siemreap',
      value: 'Siemreap',
    },
    {
      title: 'Sigmar',
      value: 'Sigmar',
    },
    {
      title: 'Sigmar One',
      value: 'Sigmar One',
    },
    {
      title: 'Signika',
      value: 'Signika',
    },
    {
      title: 'Signika Negative',
      value: 'Signika Negative',
    },
    {
      title: 'Silkscreen',
      value: 'Silkscreen',
    },
    {
      title: 'Simonetta',
      value: 'Simonetta',
    },
    {
      title: 'Single Day',
      value: 'Single Day',
    },
    {
      title: 'Sintony',
      value: 'Sintony',
    },
    {
      title: 'Sirin Stencil',
      value: 'Sirin Stencil',
    },
    {
      title: 'Six Caps',
      value: 'Six Caps',
    },
    {
      title: 'Sixtyfour',
      value: 'Sixtyfour',
    },
    {
      title: 'Skranji',
      value: 'Skranji',
    },
    {
      title: 'Slabo 13px',
      value: 'Slabo 13px',
    },
    {
      title: 'Slabo 27px',
      value: 'Slabo 27px',
    },
    {
      title: 'Slackey',
      value: 'Slackey',
    },
    {
      title: 'Slackside One',
      value: 'Slackside One',
    },
    {
      title: 'Smokum',
      value: 'Smokum',
    },
    {
      title: 'Smooch',
      value: 'Smooch',
    },
    {
      title: 'Smooch Sans',
      value: 'Smooch Sans',
    },
    {
      title: 'Smythe',
      value: 'Smythe',
    },
    {
      title: 'Sniglet',
      value: 'Sniglet',
    },
    {
      title: 'Snippet',
      value: 'Snippet',
    },
    {
      title: 'Snowburst One',
      value: 'Snowburst One',
    },
    {
      title: 'Sofadi One',
      value: 'Sofadi One',
    },
    {
      title: 'Sofia',
      value: 'Sofia',
    },
    {
      title: 'Sofia Sans',
      value: 'Sofia Sans',
    },
    {
      title: 'Sofia Sans Condensed',
      value: 'Sofia Sans Condensed',
    },
    {
      title: 'Sofia Sans Extra Condensed',
      value: 'Sofia Sans Extra Condensed',
    },
    {
      title: 'Sofia Sans Semi Condensed',
      value: 'Sofia Sans Semi Condensed',
    },
    {
      title: 'Solitreo',
      value: 'Solitreo',
    },
    {
      title: 'Solway',
      value: 'Solway',
    },
    {
      title: 'Sometype Mono',
      value: 'Sometype Mono',
    },
    {
      title: 'Song Myung',
      value: 'Song Myung',
    },
    {
      title: 'Sono',
      value: 'Sono',
    },
    {
      title: 'Sonsie One',
      value: 'Sonsie One',
    },
    {
      title: 'Sora',
      value: 'Sora',
    },
    {
      title: 'Sorts Mill Goudy',
      value: 'Sorts Mill Goudy',
    },
    {
      title: 'Source Code Pro',
      value: 'Source Code Pro',
    },
    {
      title: 'Source Sans 3',
      value: 'Source Sans 3',
    },
    {
      title: 'Source Serif 4',
      value: 'Source Serif 4',
    },
    {
      title: 'Space Grotesk',
      value: 'Space Grotesk',
    },
    {
      title: 'Space Mono',
      value: 'Space Mono',
    },
    {
      title: 'Special Elite',
      value: 'Special Elite',
    },
    {
      title: 'Spectral',
      value: 'Spectral',
    },
    {
      title: 'Spectral SC',
      value: 'Spectral SC',
    },
    {
      title: 'Spicy Rice',
      value: 'Spicy Rice',
    },
    {
      title: 'Spinnaker',
      value: 'Spinnaker',
    },
    {
      title: 'Spirax',
      value: 'Spirax',
    },
    {
      title: 'Splash',
      value: 'Splash',
    },
    {
      title: 'Spline Sans',
      value: 'Spline Sans',
    },
    {
      title: 'Spline Sans Mono',
      value: 'Spline Sans Mono',
    },
    {
      title: 'Squada One',
      value: 'Squada One',
    },
    {
      title: 'Square Peg',
      value: 'Square Peg',
    },
    {
      title: 'Sree Krushnadevaraya',
      value: 'Sree Krushnadevaraya',
    },
    {
      title: 'Sriracha',
      value: 'Sriracha',
    },
    {
      title: 'Srisakdi',
      value: 'Srisakdi',
    },
    {
      title: 'Staatliches',
      value: 'Staatliches',
    },
    {
      title: 'Stalemate',
      value: 'Stalemate',
    },
    {
      title: 'Stalinist One',
      value: 'Stalinist One',
    },
    {
      title: 'Stardos Stencil',
      value: 'Stardos Stencil',
    },
    {
      title: 'Stick',
      value: 'Stick',
    },
    {
      title: 'Stick No Bills',
      value: 'Stick No Bills',
    },
    {
      title: 'Stint Ultra Condensed',
      value: 'Stint Ultra Condensed',
    },
    {
      title: 'Stint Ultra Expanded',
      value: 'Stint Ultra Expanded',
    },
    {
      title: 'Stoke',
      value: 'Stoke',
    },
    {
      title: 'Strait',
      value: 'Strait',
    },
    {
      title: 'Style Script',
      value: 'Style Script',
    },
    {
      title: 'Stylish',
      value: 'Stylish',
    },
    {
      title: 'Sue Ellen Francisco',
      value: 'Sue Ellen Francisco',
    },
    {
      title: 'Suez One',
      value: 'Suez One',
    },
    {
      title: 'Sulphur Point',
      value: 'Sulphur Point',
    },
    {
      title: 'Sumana',
      value: 'Sumana',
    },
    {
      title: 'Sunflower',
      value: 'Sunflower',
    },
    {
      title: 'Sunshiney',
      value: 'Sunshiney',
    },
    {
      title: 'Supermercado One',
      value: 'Supermercado One',
    },
    {
      title: 'Sura',
      value: 'Sura',
    },
    {
      title: 'Suranna',
      value: 'Suranna',
    },
    {
      title: 'Suravaram',
      value: 'Suravaram',
    },
    {
      title: 'Suwannaphum',
      value: 'Suwannaphum',
    },
    {
      title: 'Swanky and Moo Moo',
      value: 'Swanky and Moo Moo',
    },
    {
      title: 'Syncopate',
      value: 'Syncopate',
    },
    {
      title: 'Syne',
      value: 'Syne',
    },
    {
      title: 'Syne Mono',
      value: 'Syne Mono',
    },
    {
      title: 'Syne Tactile',
      value: 'Syne Tactile',
    },
    {
      title: 'Tac One',
      value: 'Tac One',
    },
    {
      title: 'Tai Heritage Pro',
      value: 'Tai Heritage Pro',
    },
    {
      title: 'Tajawal',
      value: 'Tajawal',
    },
    {
      title: 'Tangerine',
      value: 'Tangerine',
    },
    {
      title: 'Tapestry',
      value: 'Tapestry',
    },
    {
      title: 'Taprom',
      value: 'Taprom',
    },
    {
      title: 'Tauri',
      value: 'Tauri',
    },
    {
      title: 'Taviraj',
      value: 'Taviraj',
    },
    {
      title: 'Teachers',
      value: 'Teachers',
    },
    {
      title: 'Teko',
      value: 'Teko',
    },
    {
      title: 'Tektur',
      value: 'Tektur',
    },
    {
      title: 'Telex',
      value: 'Telex',
    },
    {
      title: 'Tenali Ramakrishna',
      value: 'Tenali Ramakrishna',
    },
    {
      title: 'Tenor Sans',
      value: 'Tenor Sans',
    },
    {
      title: 'Text Me One',
      value: 'Text Me One',
    },
    {
      title: 'Texturina',
      value: 'Texturina',
    },
    {
      title: 'Thasadith',
      value: 'Thasadith',
    },
    {
      title: 'The Girl Next Door',
      value: 'The Girl Next Door',
    },
    {
      title: 'The Nautigal',
      value: 'The Nautigal',
    },
    {
      title: 'Tienne',
      value: 'Tienne',
    },
    {
      title: 'Tillana',
      value: 'Tillana',
    },
    {
      title: 'Tilt Neon',
      value: 'Tilt Neon',
    },
    {
      title: 'Tilt Prism',
      value: 'Tilt Prism',
    },
    {
      title: 'Tilt Warp',
      value: 'Tilt Warp',
    },
    {
      title: 'Timmana',
      value: 'Timmana',
    },
    {
      title: 'Tinos',
      value: 'Tinos',
    },
    {
      title: 'Tiny5',
      value: 'Tiny5',
    },
    {
      title: 'Tiro Bangla',
      value: 'Tiro Bangla',
    },
    {
      title: 'Tiro Devanagari Hindi',
      value: 'Tiro Devanagari Hindi',
    },
    {
      title: 'Tiro Devanagari Marathi',
      value: 'Tiro Devanagari Marathi',
    },
    {
      title: 'Tiro Devanagari Sanskrit',
      value: 'Tiro Devanagari Sanskrit',
    },
    {
      title: 'Tiro Gurmukhi',
      value: 'Tiro Gurmukhi',
    },
    {
      title: 'Tiro Kannada',
      value: 'Tiro Kannada',
    },
    {
      title: 'Tiro Tamil',
      value: 'Tiro Tamil',
    },
    {
      title: 'Tiro Telugu',
      value: 'Tiro Telugu',
    },
    {
      title: 'Titan One',
      value: 'Titan One',
    },
    {
      title: 'Titillium Web',
      value: 'Titillium Web',
    },
    {
      title: 'Tomorrow',
      value: 'Tomorrow',
    },
    {
      title: 'Tourney',
      value: 'Tourney',
    },
    {
      title: 'Trade Winds',
      value: 'Trade Winds',
    },
    {
      title: 'Train One',
      value: 'Train One',
    },
    {
      title: 'Trirong',
      value: 'Trirong',
    },
    {
      title: 'Trispace',
      value: 'Trispace',
    },
    {
      title: 'Trocchi',
      value: 'Trocchi',
    },
    {
      title: 'Trochut',
      value: 'Trochut',
    },
    {
      title: 'Truculenta',
      value: 'Truculenta',
    },
    {
      title: 'Trykker',
      value: 'Trykker',
    },
    {
      title: 'Tsukimi Rounded',
      value: 'Tsukimi Rounded',
    },
    {
      title: 'Tulpen One',
      value: 'Tulpen One',
    },
    {
      title: 'Turret Road',
      value: 'Turret Road',
    },
    {
      title: 'Twinkle Star',
      value: 'Twinkle Star',
    },
    {
      title: 'Ubuntu',
      value: 'Ubuntu',
    },
    {
      title: 'Ubuntu Condensed',
      value: 'Ubuntu Condensed',
    },
    {
      title: 'Ubuntu Mono',
      value: 'Ubuntu Mono',
    },
    {
      title: 'Ubuntu Sans',
      value: 'Ubuntu Sans',
    },
    {
      title: 'Ubuntu Sans Mono',
      value: 'Ubuntu Sans Mono',
    },
    {
      title: 'Uchen',
      value: 'Uchen',
    },
    {
      title: 'Ultra',
      value: 'Ultra',
    },
    {
      title: 'Unbounded',
      value: 'Unbounded',
    },
    {
      title: 'Uncial Antiqua',
      value: 'Uncial Antiqua',
    },
    {
      title: 'Underdog',
      value: 'Underdog',
    },
    {
      title: 'Unica One',
      value: 'Unica One',
    },
    {
      title: 'UnifrakturCook',
      value: 'UnifrakturCook',
    },
    {
      title: 'UnifrakturMaguntia',
      value: 'UnifrakturMaguntia',
    },
    {
      title: 'Unkempt',
      value: 'Unkempt',
    },
    {
      title: 'Unlock',
      value: 'Unlock',
    },
    {
      title: 'Unna',
      value: 'Unna',
    },
    {
      title: 'Updock',
      value: 'Updock',
    },
    {
      title: 'Urbanist',
      value: 'Urbanist',
    },
    {
      title: 'VT323',
      value: 'VT323',
    },
    {
      title: 'Vampiro One',
      value: 'Vampiro One',
    },
    {
      title: 'Varela',
      value: 'Varela',
    },
    {
      title: 'Varela Round',
      value: 'Varela Round',
    },
    {
      title: 'Varta',
      value: 'Varta',
    },
    {
      title: 'Vast Shadow',
      value: 'Vast Shadow',
    },
    {
      title: 'Vazirmatn',
      value: 'Vazirmatn',
    },
    {
      title: 'Vesper Libre',
      value: 'Vesper Libre',
    },
    {
      title: 'Viaoda Libre',
      value: 'Viaoda Libre',
    },
    {
      title: 'Vibes',
      value: 'Vibes',
    },
    {
      title: 'Vibur',
      value: 'Vibur',
    },
    {
      title: 'Victor Mono',
      value: 'Victor Mono',
    },
    {
      title: 'Vidaloka',
      value: 'Vidaloka',
    },
    {
      title: 'Viga',
      value: 'Viga',
    },
    {
      title: 'Vina Sans',
      value: 'Vina Sans',
    },
    {
      title: 'Voces',
      value: 'Voces',
    },
    {
      title: 'Volkhov',
      value: 'Volkhov',
    },
    {
      title: 'Vollkorn',
      value: 'Vollkorn',
    },
    {
      title: 'Vollkorn SC',
      value: 'Vollkorn SC',
    },
    {
      title: 'Voltaire',
      value: 'Voltaire',
    },
    {
      title: 'Vujahday Script',
      value: 'Vujahday Script',
    },
    {
      title: 'Waiting for the Sunrise',
      value: 'Waiting for the Sunrise',
    },
    {
      title: 'Wallpoet',
      value: 'Wallpoet',
    },
    {
      title: 'Walter Turncoat',
      value: 'Walter Turncoat',
    },
    {
      title: 'Warnes',
      value: 'Warnes',
    },
    {
      title: 'Water Brush',
      value: 'Water Brush',
    },
    {
      title: 'Waterfall',
      value: 'Waterfall',
    },
    {
      title: 'Wavefont',
      value: 'Wavefont',
    },
    {
      title: 'Wellfleet',
      value: 'Wellfleet',
    },
    {
      title: 'Wendy One',
      value: 'Wendy One',
    },
    {
      title: 'Whisper',
      value: 'Whisper',
    },
    {
      title: 'WindSong',
      value: 'WindSong',
    },
    {
      title: 'Wire One',
      value: 'Wire One',
    },
    {
      title: 'Wittgenstein',
      value: 'Wittgenstein',
    },
    {
      title: 'Wix Madefor Display',
      value: 'Wix Madefor Display',
    },
    {
      title: 'Wix Madefor Text',
      value: 'Wix Madefor Text',
    },
    {
      title: 'Work Sans',
      value: 'Work Sans',
    },
    {
      title: 'Workbench',
      value: 'Workbench',
    },
    {
      title: 'Xanh Mono',
      value: 'Xanh Mono',
    },
    {
      title: 'Yaldevi',
      value: 'Yaldevi',
    },
    {
      title: 'Yanone Kaffeesatz',
      value: 'Yanone Kaffeesatz',
    },
    {
      title: 'Yantramanav',
      value: 'Yantramanav',
    },
    {
      title: 'Yarndings 12',
      value: 'Yarndings 12',
    },
    {
      title: 'Yarndings 12 Charted',
      value: 'Yarndings 12 Charted',
    },
    {
      title: 'Yarndings 20',
      value: 'Yarndings 20',
    },
    {
      title: 'Yarndings 20 Charted',
      value: 'Yarndings 20 Charted',
    },
    {
      title: 'Yatra One',
      value: 'Yatra One',
    },
    {
      title: 'Yellowtail',
      value: 'Yellowtail',
    },
    {
      title: 'Yeon Sung',
      value: 'Yeon Sung',
    },
    {
      title: 'Yeseva One',
      value: 'Yeseva One',
    },
    {
      title: 'Yesteryear',
      value: 'Yesteryear',
    },
    {
      title: 'Yomogi',
      value: 'Yomogi',
    },
    {
      title: 'Young Serif',
      value: 'Young Serif',
    },
    {
      title: 'Yrsa',
      value: 'Yrsa',
    },
    {
      title: 'Ysabeau',
      value: 'Ysabeau',
    },
    {
      title: 'Ysabeau Infant',
      value: 'Ysabeau Infant',
    },
    {
      title: 'Ysabeau Office',
      value: 'Ysabeau Office',
    },
    {
      title: 'Ysabeau SC',
      value: 'Ysabeau SC',
    },
    {
      title: 'Yuji Boku',
      value: 'Yuji Boku',
    },
    {
      title: 'Yuji Hentaigana Akari',
      value: 'Yuji Hentaigana Akari',
    },
    {
      title: 'Yuji Hentaigana Akebono',
      value: 'Yuji Hentaigana Akebono',
    },
    {
      title: 'Yuji Mai',
      value: 'Yuji Mai',
    },
    {
      title: 'Yuji Syuku',
      value: 'Yuji Syuku',
    },
    {
      title: 'Yusei Magic',
      value: 'Yusei Magic',
    },
    {
      title: 'ZCOOL KuaiLe',
      value: 'ZCOOL KuaiLe',
    },
    {
      title: 'ZCOOL QingKe HuangYou',
      value: 'ZCOOL QingKe HuangYou',
    },
    {
      title: 'ZCOOL XiaoWei',
      value: 'ZCOOL XiaoWei',
    },
    {
      title: 'Zain',
      value: 'Zain',
    },
    {
      title: 'Zen Antique',
      value: 'Zen Antique',
    },
    {
      title: 'Zen Antique Soft',
      value: 'Zen Antique Soft',
    },
    {
      title: 'Zen Dots',
      value: 'Zen Dots',
    },
    {
      title: 'Zen Kaku Gothic Antique',
      value: 'Zen Kaku Gothic Antique',
    },
    {
      title: 'Zen Kaku Gothic New',
      value: 'Zen Kaku Gothic New',
    },
    {
      title: 'Zen Kurenaido',
      value: 'Zen Kurenaido',
    },
    {
      title: 'Zen Loop',
      value: 'Zen Loop',
    },
    {
      title: 'Zen Maru Gothic',
      value: 'Zen Maru Gothic',
    },
    {
      title: 'Zen Old Mincho',
      value: 'Zen Old Mincho',
    },
    {
      title: 'Zen Tokyo Zoo',
      value: 'Zen Tokyo Zoo',
    },
    {
      title: 'Zeyada',
      value: 'Zeyada',
    },
    {
      title: 'Zhi Mang Xing',
      value: 'Zhi Mang Xing',
    },
    {
      title: 'Zilla Slab',
      value: 'Zilla Slab',
    },
    {
      title: 'Zilla Slab Highlight',
      value: 'Zilla Slab Highlight',
    },
  ];

  public static fontsSettingView(gvc: GVC, globalValue: any, detail: boolean) {
    const html = String.raw;
    return gvc.bindView(() => {
      globalValue.font_theme = globalValue.font_theme ?? [];
      const vm_c: {
        toggle: boolean;
        id: string;
        loading: boolean;
        fonts: any;
      } = {
        toggle: detail ?? false,
        id: gvc.glitter.getUUID(),
        loading: false,
        fonts: FontsConfig.value,
      };
      return {
        bind: vm_c.id,
        view: () => {
          if (vm_c.loading) {
            return html` <div class="w-100 d-flex align-items-center justify-content-center p-3">
              <div class="spinner-border"></div>
            </div>`;
          }
          const array = [
            html` <div
              class="hoverF2 d-flex align-items-center p-3 ${detail ? `d-none` : ``}"
              onclick="${gvc.event(() => {
                vm_c.toggle = !vm_c.toggle;
                gvc.notifyDataChange(vm_c.id);
              })}"
            >
              <span
                class="fw-500"
                style="max-width: calc(100% - 50px);text-overflow: ellipsis;white-space: nowrap;overflow: hidden;"
                >字型樣式</span
              >
              <div class="flex-fill"></div>
              ${vm_c.toggle
                ? ` <i class="fa-solid fa-chevron-down"></i>`
                : ` <i class="fa-solid fa-chevron-right"></i>`}
            </div>`,
          ];
          if (vm_c.toggle) {
            array.push(
              html` <div
                  class="row ${globalValue.font_theme.length === 0 ? `d-none` : ``} px-0 pt-2 pb-0 m-0"
                  style="margin: 18px 18px 0px;"
                >
                  ${globalValue.font_theme
                    .map((dd: any, index: number) => {
                      return gvc.bindView(() => {
                        const id = gvc.glitter.getUUID();

                        function refresh() {
                          gvc.notifyDataChange(id);
                        }

                        return {
                          bind: id,
                          view: () => {
                            return ` <div class="rounded border p-2 d-flex  w-100 flex-column" style="gap:10px;">
                                                ${BgWidget.title(index === 0 ? `預設字型` : dd.value || `字型樣式 ${index}`, 'font-size: 16px;')}
                                                <div class="d-flex align-items-center" style="gap:10px;">
                                                    <div class="form-control" style="cursor:pointer;" onclick="${gvc.event(
                                                      () => {
                                                        BgWidget.settingDialog({
                                                          gvc: gvc,
                                                          title: '選擇字型',
                                                          innerHTML: (gvc: GVC) => {
                                                            const input_id = gvc.glitter.getUUID();
                                                            const container_id = gvc.glitter.getUUID();
                                                            let search = '';
                                                            return `<div class="w-100">
${
                                                              [
                                                                BgWidget.editeInput({
                                                                  gvc: gvc,
                                                                  default: search,
                                                                  title: `<div class="d-flex align-items-center" style="gap:5px;">快速搜尋${BgWidget.greenNote(`<div onclick="${gvc.event(()=>{
                                                                    gvc.glitter.openNewTab('https://fonts.google.com/')
                                                                  })}" style="cursor:pointer;">採用Google Fonts 標準字型</div>`)}</div>`,
                                                                  placeHolder: '快速搜尋',
                                                                  oninput: (text: any) => {
                                                                    search = text;
                                                                    gvc.notifyDataChange(container_id);
                                                                  },
                                                                  callback: text => {},
                                                                }),
                                                                gvc.bindView(() => {
                                                                  return {
                                                                    bind: container_id,
                                                                    view: () => {
                                                                      return vm_c.fonts
                                                                        .map((dd: any, index: number) => {
                                                                          return dd.title;
                                                                        })
                                                                        .filter((dd: any) => {
                                                                          return dd.toLowerCase().includes(search.toLowerCase());
                                                                        })
                                                                        .map((d1: any,index:number) => {
                                                                          return html` <div class="d-flex">
                                                                          ${BgWidget.title(`${index+1}. ${d1}`)}
                                                                          <div class="flex-fill"></div>
                                                                          ${BgWidget.save(
                                                                            gvc.event(() => {
                                                                              dd.value = d1;
                                                                              refresh();
                                                                              gvc.closeDialog()
                                                                            }),
                                                                            '選擇'
                                                                          )}
                                                                        </div>`;
                                                                        }).join('<div class="w-100 my-2 border-top"></div>');
                                                                    },
                                                                  };
                                                                }),
                                                              ].join(BgWidget.horizontalLine())
                                                            }
</div>`;
                                                          },
                                                          footer_html: (gvc: GVC) => {
                                                            return [
                                                            ].join('');
                                                          },
                                                        });
                                                      }
                                                    )}">
                                                      ${dd.value || '尚未設定'} 
                                                    </div>
                                                    ${
                                                      index !== 0
                                                        ? BgWidget.cancel(
                                                            gvc.event(() => {
                                                              const dialog = new ShareDialog(gvc.glitter);
                                                              dialog.checkYesOrNot({
                                                                text: '是否確認刪除此字型?',
                                                                callback: response => {
                                                                  if (response) {
                                                                    globalValue.font_theme.splice(index, 1);
                                                                    gvc.notifyDataChange(vm_c.id);
                                                                  }
                                                                },
                                                              });
                                                            }),
                                                            '<i class="fa-solid  fa-trash-can"></i>'
                                                          )
                                                        : ``
                                                    }
                                                </div>
                                            </div>
                                            <div class="d-flex p-2 align-items-center" style="gap:10px;">
                                                <div class="fs-6">預覽字體:</div>
                                                <div class="fs-6 bgf6 p-2" style="font-family: '${dd.value}' !important;">字型</div>
                                                <div class="fs-6 bgf6 p-2" style="font-family: '${dd.value}' !important;">fonts</div>
                                            </div>`;
                          },
                          divCreate: {
                            class: `col-12 mb-3`,
                            style: `cursor: pointer;`,
                          },
                        };
                      });
                    })
                    .join('')}
                </div>
                <div class="px-2 mb-2" style="${globalValue.font_theme.length === 0 ? `` : ``}">
                  <div
                    class="bt_border_editor"
                    onclick="${gvc.event((e, event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      globalValue.font_theme.push({
                        value: '',
                        title: '',
                      });
                      FontsConfig.reInitialFontTheme(globalValue, gvc);
                      gvc.notifyDataChange(vm_c.id);
                    })}"
                  >
                    新增字型
                  </div>
                </div>`
            );
          }
          return array.join('');
        },
        divCreate: {
          class: `border-bottom w-100`,
        },
      };
    });
  }

  public static reInitialFontTheme(globalValue: any, gvc: GVC) {
    const window: any = gvc.glitter.document.querySelector('#editerCenter  iframe').contentWindow;
    window.glitter.share.font_theme = globalValue.font_theme;
    window.glitter.share.font_theme.map((dd: any) => {
      // 找不到字型則加上去
      if (
        !window.glitter.share.initial_fonts.find((d1: any) => {
          return d1 === dd.value;
        }) &&
        dd.value
      ) {
        window.glitter.addStyle(`@import url('https://fonts.googleapis.com/css2?family=${dd.value}&display=swap');`);
      }
    });
    const element = window.glitter.elementCallback;
    Object.keys(element).map(dd => {
      try {
        element[dd].updateAttribute();
      } catch (e) {}
    });
  }
}

(window as any).glitter.setModule(import.meta.url, FontsConfig);
