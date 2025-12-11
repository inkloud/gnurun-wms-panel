# TODO

## Development \*\*\*

- Focus on the **Picker** working page:

  - ~~Refactor the table to use a structure like~~:

    ```python
    @dataclass(frozen=True)
    class SimpleProduct:
      id: str
      sku: str
      name: str

    @dataclass(frozen=True)
    class SimpleOrder:
      id: str
      quantity: int

    @dataclass(frozen=True)
    class FulfillmentOrderPosition:
      position: str
      product: SimpleProduct
      orders: list[SimpleOrder]
    ```

    ~~Update backend and frontend as needed; the router may produce the desired view model~~.

  - When I scan a product, a modal will show quantity and order to put the product. Confirm the position if necessary! Then show quantity and order.
  - Decorate the product table with clearer information: what has already been scanned and by whom.
  - For each item, scan either the `SKU` barcode or the `serial-number`; when a serial is required, scan every unit. Manage a picker session object, potentially in the cloud.
  - Explore smarter ordering of items (a strategy pattern may help here).

- Test when I have in the same positions different orders.

- Show order progress (e.g., completion percent).

- Decide how to handle errors: missing items or broken items (mostly missing).

- Add a breadcrumb to each page.

- Clarify the difference between items assigned to me and items assigned to others; make the separation obvious.

- Allow viewing details of a single _Fulfillment Order_ even if it is unassigned.

- Verify that the `MANAGER` user can run the **Picker** and other functions. Add a "Continue as manager" option to the authentication page.

- Create a dummy template for an empty `Operation`.

- Plan a path toward a real DB.

## Refactoring

- ~~Refactor the random generator: at module import time create products and fulfillment orders, plus the "fulfillment order products."~~

- ~~The "Fulfillment Order Product" should be returned by the service, implementing the business logic to decide which products to select from different positions. The ordering of positions should be a responsibility of this layer.~~

- ~~The frontend API folder should not depend on hook entities. The reverse is better: hooks receive raw data from the API, similar to the backend. I may have changed my mind here... maybe the service is central and the hooks are central too.~~
  ~~Let's try to use both in services and data_gateway what I defined under domain. Let's start with the interface and then with the entities.~~

- ~~When I reload the [page](/picker) I lost the state?~~

- Linter!

- Every SKU should have a specific position (currently random: same SKU shows different positions across orders). Only occasionally should the same SKU appear in more than one position.

- Check multitenancy. Is it handled correctly?

- Review the [auth](frontend/src/hooks/auth/) folder in the frontend.

  - In [providers.ts](frontend/src/hooks/auth/providers.ts), move validation to the API using `zod`.

- Consider offline support [https://yjs.dev/][https://automerge.org/][https://github.com/Dancode-188/synckit].

- Frontend hooks and backend API for the list of available _Operation_?

- Rework this snippet in `app.tsx`: `<h1 className="h2 mb-1 text-dark">Welcome back, {user.user.name.split(' ')[0]}!</h1>`.

- Apply more Clean Architecture principles to backend authentication. I've done most of this. Check!

  - It seems I now have a clear idea of Clean Architecture on both the `FastAPI` side and the `ReactJS` side.

- Consolidate shared UI primitives (buttons, alerts) into a design system folder; more work needed here.

## DevOps

- Consider a production configuration with Caddy as a separate component. Maybe [Traefik](https://doc.traefik.io/traefik/getting-started/install-traefik/) instead?

  - First consider an experiment with `caddy` as a separate project, but using this solution:

    ```
    docker network create web
    ```

    ```
      services:
      traefik:
        ...
        networks:
          - web

    networks:
      web:
        external: true


    services:
      whoami:
        ...
        networks:
          - web

    networks:
      web:
        external: true
    ```

  - Consider `traefik`.

- Review [this](https://www.youtube.com/watch?v=Af6Zr0tNNdE) FastAPI Template.

- What about moving to my personal github?

- Deploy somewhere on AWS.

- Have a look at the documentation, write down better.

- Set up deployment pipeline targeting staging and production environments.

- Configure CI to run linting and tests on pull requests.

- Consider creating a `Notion` page for this; maybe this markdown file is enough.
