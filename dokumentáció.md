# Konzol webshop dokumentáció
## Bevezetés
 ### Témaválasztás indoklása
 A konzol árusító oldal ötlete a csapat videójátékok iránti szenvedélyéből ered. A webshop ötlet már hamar felmerült, viszont a játékkonzolos fő téma csak később került szóba.
 ### Záródolgozatom témája, mégis milyen funkciókat foglal magába?
 Egy videójáték konzolok árusítására specializálódott internetes áruház, ahol felhasználók feltölthetnek hirdetéseket, illetve böngészhetnek azok között. A weboldal fő funkciói közé tartozik a felhasználói profil regisztrációja és testreszabása, a hirdetések közzétéle, a hirdetések részletes keresése.
 ### Sajátosságok
 Weboldalunk fő sajátossága más felhasználók által vezérelt áruházzal szemben a részletes szűrési lehetőség a hirdetések létrehzása és keresése közben. Ez a rendszer lehetővé teszi, hogy a felhasználók könnyedén megtalálják azokat a hirdetéseket amelyek a számukra megfelelőek.
## Fejlesztői dokumentáció
 ### Felhasznált programozási nyelvek és keretrendszerek
  #### Backend
  - <ins>Nest.js</ins>
    - Programozási nyelv: Typescript/Javascript 
  #### Frontend
  - <ins>SvelteKit</ins>
    - Programozási nyelv: Typescript/Javascript, SCSS/CSS
 ### Fejlesztői környezet
  #### Github és git
  Projektmunkánk során verziókezelőként a Git rendszerét választottuk, amelyet online a Github szolgáltalásaival tárolunk. Ezzel nagyban megkönyítettük a fejlesztési folyamatot és a változtatások egymással való megosztását.
  #### Tesztelési keretrendszerek
  - **Backend: Pytest**
    - A Pytest egy, a python programozási nyelven alapuló tesztelési keretrendszer amellyel bárki létre tud hozni testreszabott teszteket egyszerűen.
  - **Frontend: PlayWright**
    - A PlayWright egy úgynevezett "End-to-End" tesztelési keretrendszer, amellyel egyszerűen tudjuk tesztelni a weblapjainkat a felhasználók szemszögéből, ezzel biztosítva a megfelelő kinézetet és viselkedést.
 ### Kialakított adatszerkezet
  #### Adatbázis táblái
   ##### A `users` tábla
   ##### Az `adverts` tábla
   ##### A `locations` tábla
   ##### A `manufacturers` tábla
   ##### A `migrations` tábla
   ##### A `product_states` tábla
   ##### A `models` tábla
   ##### A `suggestions` tábla
   ##### A `bookmarks` tábla
   ##### A `cart_items` tábla
   ##### A `comments` tábla
   ##### Az `advert_pics` tábla
 ### Algoritmusok a backend és frontend megvalósításban
  #### Felhasználó regisztrációs folyamat backend oldal
   Egy felhasználó regisztrációja a bejelentkezés alapfeltétele. Ez után válik használhatóvá a bejelentkező képernyő és vele együtt a bejelentkezett felhasználóknak nyújtott funkciók.

   A regisztrációt a backend a `POST /api/user` request segítségével biztosítja. Az adatokat érzékenységük miatt természetesen a kérés body-jában fogadja, HTTPS titkosításra hagyadkozva. Hibakezelés után létrehozza a felhasználót, majd visszaadja az id-jét.

   A kérés elküldése után ez a kódrészlet fut le:

   ```ts
   // TODO: Nem végleges
   async create(dto: CreateUserDto): Promise<number> {
     if (await this.userRepository.existsBy({ name: dto.name })) {
       throw new BadRequestException('Username is taken');
     }
     let passHash = await UserService._hashPass(dto.password);
     let toInsert = new User(dto.name, dto.email, passHash, getIsoDate());
     let result = await this.userRepository.insert(toInsert);
     return result.identifiers[0].id;
   }
   ```

   Először a felhasználónév foglaltságát ellenőrizzük. Ez után a jelszó hashelése történik.
   Így elkerüljük a jelszó az adatbázisban szövegként történő tárolását.
   Létrehozzuk a beillesztendő entity-t, majd eltároljuk az adatbázisban.
   Az eltárolt sor id-jét visszaadjuk.

   #### Felhasználó regisztrációs folyamat frontend oldal
   #### Felhasználó belépési folyamat backend oldal
    Belépett felhasználók a hirdetések megtekintésén és keresésén kívül sok más funkciót is elérhetnek.

    A belépést a backend a `POST /api/auth/login` request segítségével biztosítja. Az adatok itt is a body-ban kerülnek továbbításra.

    Ha a belépési adatok helyesek, egy token-t adunk vissza. A továbbiakban ez lesz használható a bejelentkezést igénylő funkciók eléréséhez.

    ```ts
    // TODO: Nem végleges
    async logIn(username: string, password: string) {
      const hash = await this.usersService._getPassHashFromName(username);
      if (hash == null) {
        throw new UnauthorizedException('No such user');
      }
      if (!(await bcrypt.compare(password, hash))) {
        throw new UnauthorizedException('Invalid password');
      }

      const userId = await this.usersService._getIdFromName(username);
      const isAdmin = await this.usersService._getIsAdminFromName(username);

      return {
        access_token: await this.jwtService.signAsync(
          { username, id: userId, isAdmin },
          { secret: jwtConstants.secret },
        ),
      };
    }
    ```

    Az adabázisból lekérjük a jelszó hashet ha ez nem létezik, vagy nem egyezik a felhasználó által megadott jelszóval, `401 Unauthorized` hibát adunk vissza.

    Lekérjuk a felhasználó azonosítóját és az admin jogot tároló értéket. Ezek után legeneráljuk a token-t és visszaadjuk.

    A bejelentkezést igénylő endpointokat a következő decoratorral jelölhetjük meg: `@UseGuards(JwtAuthGuard)`.
    A tokent-t a guard-ban a következő módon használjuk fel:

    ```ts
    // TODO: Nem végleges
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }
      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
      } catch {
        throw new UnauthorizedException();
      }

      const onlyAllowAdmin = this.reflector.get(
        IS_ADMIN_ONLY_KEY,
        context.getHandler(),
      );

      if (onlyAllowAdmin && !payload.isAdmin) {
        throw new ForbiddenException();
      }

      request['user'] = payload;
      return true;
    }
    ```

    A tokent visszaalakítjuk a payloaddá, majd ellenőrzéseket végzünk rajta. Egy másik decorator segítségével endpointokat csak admin által elérhetővé tehetünk. Ha ez az endpoint ilyen, ellenőrizzük, hogy a felhasználó admin-e. Ha a token rossz, hibát adunk vissza.
   #### Felhasználó belépési folyamat frontend oldal
   #### Hirdetés feltöltési folyamat backand oldal
   #### Hirdetés feltöltési folyamat frontend oldal
   #### Keresési folyamat backend oldal
   #### Keresési folyamat frontend oldal
  ### Különböző körülmények, esetek és hibakezelések
<!-- ## Üres profil oldal lezárolt telefon után
## Üres képek a galériában
## Az időpontfoglalás kijátszása
## Foglalt időpon
## Nagyon előre tervezett időpontfoglalás -->
<!-- #### Belépési folyamat kezelése -->
### Fejlesztési lehetőségek
## Teszt dokumentáció
 ### Backend tesztek
 ### Frontend tesztek
## Felhasználói dokumentáció
 ### Üdvözöllek!
 ### Szükséges eszközök a weboldal használatához
 ### Weboldal eléréséhez használható böngészők
 ### Weboldal használatának részletes ismertetése
 ### A regisztráció folyamatának ismertetése
 ### A belépés folyamatának ismertetése
 ### Hirdetés feltöltés folyamatának ismertetése
 ### Hirdetés keresés folyamatának ismertetése
 ### Hirdetés vásárlás folyamatának ismertetése
## Összefoglalás
 ### Elkészült munkánk értékelése
 ### Köszönetnyilvánítás
## Irodalomjegyzék