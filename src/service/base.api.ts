import type { Paginated } from "@/pagination/paginated";
import type { Ref } from "vue";
import { ref } from "vue";
import { keycloak } from "@/main";

export class BaseCreate<T> {
  constructor(public apiUrl: string) {}
  entity = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(entity: T) {
    this.error.value = undefined;
    this.processing.value = true;

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }

    const res = await fetch(`${this.apiUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${keycloak.token}` },
      body: JSON.stringify(entity),
    });
    const response = await res.json();
    if (res.ok) {
      this.entity.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseUpdate<T, ID> {
  constructor(public apiUrl: string) {}
  entity = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(id: ID, entity: T) {
    this.error.value = undefined;
    this.processing.value = true;

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }

    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", authorization: `Bearer ${keycloak.token}` },
      body: JSON.stringify(entity),
    });
    const response = await res.json();
    if (res.ok) {
      this.entity.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseFindById<T, ID> {
  constructor(public apiUrl: string) {}
  entity = ref<T>();
  error = ref<any>();
  processing = ref(false);

  async doFetch(id: ID) {
    this.error.value = undefined;
    this.processing.value = true;

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }

    const res = await fetch(`${this.apiUrl}/${id}`, {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${keycloak.token}`,
      },
    });
    const response = await res.json();
    if (res.ok) {
      this.entity.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }
}

export class BaseFindPage<T> {
  constructor(public apiUrl: string) {}
  page = ref<Paginated<T>>() as Ref<Paginated<T>>;
  error = ref<any>();
  processing = ref(false);

  async doFetch(pageNumber: number, limit: number, text: string) {
    this.error.value = undefined;
    this.processing.value = true;

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }

    const res = await fetch(this.getUrl(pageNumber, limit, text), {
      headers: {
        accept: "application/json",
        authorization: `Bearer ${keycloak.token}`,
      },
    });
    const response = await res.json();
    if (res.ok) {
      this.page.value = response;
    } else {
      console.error(response);
      this.error.value = response;
    }
    this.processing.value = false;
  }

  getUrl(pageNumber: number, limit: number, text: string) {
    const params = new URLSearchParams({
      page: pageNumber.toString(),
      limit: limit.toString(),
      text: text,
    });
    return `${this.apiUrl}?${params.toString()}`;
  }
}

export class BaseRemove<ID> {
  constructor(public apiUrl: string) {}
  error = ref<any>();
  processing = ref(false);
  removing = ref<ID[]>([]) as Ref<ID[]>;

  async doFetch(id: ID) {
    this.error.value = undefined;
    this.processing.value = true;
    this.removing.value.push(id);

    try {
      await keycloak.updateToken(30);
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }

    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${keycloak.token}` },
    });
    if (!res.ok) {
      const response = await res.json();
      console.error(response);
      this.error.value = response;
    }
    const index = this.removing.value.findIndex((value) => value == id);
    this.removing.value.splice(index, 1);
    this.processing.value = false;
  }

  isRemoving(id: ID) {
    return this.removing.value.findIndex((value) => value === id) !== -1;
  }
}
