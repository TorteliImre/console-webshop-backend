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
   ##### A `locations` tábla
   ##### A `manufacturers` tábla
   ##### A `migrations` tábla
   ##### A `product_states` tábla
   ##### A `users` tábla
   ##### A `models` tábla
   ##### A `suggestions` tábla
   ##### Az `adverts` tábla
   ##### A `bookmarks` tábla
   ##### A `cart_items` tábla
   ##### A `comments` tábla
   ##### A `purchases` tábla
   ##### A `ratings` tábla
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
   A regisztrációs felület az `/auth/register` aloldalon érhető el. Ez az oldal a bejelentkezés oldallal egybefűzött, így ez a két oldal szinte ugyan az.

   A form kódja a következő:
   ```html
   <form method="post">
     <h1>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</h1>
     <div class="group">
         <label for="name">Felhasználó név</label>
         <input autofocus type="text" id="name" name="name" required maxlength="20" on:change={limitTo20} />
     </div>

     {#if data.action === "register"}
         <div class="group">
             <label for="email">E-mail</label>
             <input type="email" id="email" name="email" required />
         </div>
     {/if}

     <div class="group">
         <label for="password">Jelszó</label>
         <input type="password" name="password" id="password" required />
     </div>

     <span id="error">{form?.message || ""}</span>

     {#if data.action === "login"}
         <a href="register">Regisztráció</a>
     {/if}

     <input
         type="submit"
         formaction="?/{data.action}"
         value={data.action === "login" ? "Bejelentkezés" : "Regisztráció"}
     />
   </form>
   ```

   A `data` változót tartalmazza az URL utolsó szekcióját, az úgynevezett `action` változót.

   A form leadása után a következő kódrészlet fut le:

   ```ts
   register: async ({ cookies, request }) => {
        const data = await request.formData();
        const username = data.get("name");
        const password = data.get("password");
        const email = data.get("email");

        console.log(username, password, email);

        if (username === null || password === null || email === null) return { message: "Invalid input" };

        console.log(`${apiPath}/user/create`);

        const res = await fetch(`${apiPath}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                password,
                email
            })
        });
        if (res.ok || res.status == 201) {
            return redirect(302, "/auth");
        }
        const body = await res.json();
        return { message: body.message };
   }
   ```

   Az oldal bejelentkezés után nem elérhető. Ezt minden betöltésnél a `LayoutServerLoad` funkció teszi lehetővé.

   ```ts
   export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (token != undefined) {
        return redirect(302, "/");
    }
   };
   ```

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

   Az adabázisból lekérjük a jelszó hashet. Ha ez nem létezik, vagy nem egyezik a felhasználó által megadott jelszóval, `401 Unauthorized` hibát adunk vissza.

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
   A bejelntkezési felület az `/auth/login` aloldalon érhető el. Ez az oldal a regisztrációs oldallal egybefűzött, így ez a két oldal szinte ugyan az.

   A form kódja a következő:
   ```html
   <form method="post">
     <h1>{data.action === "login" ? "Bejelentkezés" : "Regisztráció"}</h1>
     <div class="group">
         <label for="name">Felhasználó név</label>
         <input autofocus type="text" id="name" name="name" required maxlength="20" on:change={limitTo20} />
     </div>

     {#if data.action === "register"}
         <div class="group">
             <label for="email">E-mail</label>
             <input type="email" id="email" name="email" required />
         </div>
     {/if}

     <div class="group">
         <label for="password">Jelszó</label>
         <input type="password" name="password" id="password" required />
     </div>

     <span id="error">{form?.message || ""}</span>

     {#if data.action === "login"}
         <a href="register">Regisztráció</a>
     {/if}

     <input
         type="submit"
         formaction="?/{data.action}"
         value={data.action === "login" ? "Bejelentkezés" : "Regisztráció"}
     />
   </form>
   ```

   A `data` változót tartalmazza az URL utolsó szekcióját, az úgynevezett `action` változót.

   A form leadása után a következő kódrészlet fut le:

   ```ts
   login: async ({ cookies, request }) => {
        //TODO debug
        const data = await request.formData();
        const username = data.get("name");
        const password = data.get("password");

        if (username === null || password === null) return { message: "Invalid input" };

        const res = await fetch(`${apiPath}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: username,
                password
            })
        });

        const body = await res.json();

        if (res.status == 201) {
            //TODO
            cookies.set("token", body.access_token, {
                path: "/",
                maxAge: 60 * 60,
                httpOnly: true,
                sameSite: "strict",
                secure: false
            });
            return redirect(302, "/");
        }
        return { message: body.message };
   }
   ```

   Az oldal bejelentkezés után nem elérhető. Ezt minden betöltésnél a `LayoutServerLoad` funkció teszi lehetővé.

   ```ts
   export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (token != undefined) {
        return redirect(302, "/");
    }
   };
   ```
   #### Hirdetés feltöltési folyamat backand oldal

    A hirdetések feltöltése az oldal legfontosabb funkciója. A feltöltéskor megadhatjuk az eladni kívánt termék adatait, árát, leírását és annak helyét.
    A videójáték-konzol modellének megadása a webáruház egyik fő sajátossága. Segítségével egyértelműen megjelölhetjük a terméket.
    És keresésnél a modell vagy gyártó alapj segít megtalálni a számunkra megfelelő hirdetéseket.



   #### Hirdetés feltöltési folyamat frontend oldal
   A hirdetés feltöltésére szolgáló oldalt az `advert/create` címen érhetjük el, vagy az "Új hirdetés" menüpontra kattintva a felhasználói menüben.
   Az oldalon egy négy részre osztott felhasználói felület tárul elénk.
   - Az első rész, amely bal-felül található a hirdetéshez tartozó képek  két féle módon történő feltöltésére szolgál
     - A plussz (+) gombra kattintva az böngésző segítségével kiválaszthatunk képeket amelyeket fel akarunk tölteni.
       - kódblock
     - A fájlokat a szekcióra dobva (Drag&Drop) a mozgatott fájlok feltöltésre kerülnek

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