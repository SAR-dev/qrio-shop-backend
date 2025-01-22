/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Categories = "categories",
	Comments = "comments",
	FeaturedCategories = "featuredCategories",
	FeaturedProducts = "featuredProducts",
	FeaturedSeries = "featuredSeries",
	Images = "images",
	Products = "products",
	PromotedProducts = "promotedProducts",
	Series = "series",
	Users = "users",
	Wishlists = "wishlists",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type CategoriesRecord = {
	created?: IsoDateString
	description?: string
	id: string
	slug: string
	thumbnail?: string
	title?: string
	updated?: IsoDateString
}

export type CommentsRecord = {
	created?: IsoDateString
	details: string
	id: string
	title?: string
	updated?: IsoDateString
	users?: RecordIdString
}

export type FeaturedCategoriesRecord = {
	categories: RecordIdString
	created?: IsoDateString
	id: string
	updated?: IsoDateString
}

export type FeaturedProductsRecord = {
	created?: IsoDateString
	id: string
	products: RecordIdString
	updated?: IsoDateString
}

export type FeaturedSeriesRecord = {
	created?: IsoDateString
	id: string
	series: RecordIdString
	updated?: IsoDateString
}

export type ImagesRecord = {
	created?: IsoDateString
	id: string
	source: string
	updated?: IsoDateString
}

export type ProductsRecord<Ttags = unknown> = {
	buyingPrice?: number
	categories?: RecordIdString
	created?: IsoDateString
	description?: HTMLString
	discount?: number
	id: string
	image1?: string
	image2?: string
	image3?: string
	image4?: string
	priority: number
	sellingPrice: number
	series?: RecordIdString
	slug: string
	summary?: string
	tags?: null | Ttags
	title?: string
	updated?: IsoDateString
}

export type PromotedProductsRecord = {
	created?: IsoDateString
	id: string
	products: RecordIdString
	updated?: IsoDateString
}

export type SeriesRecord = {
	cover?: string
	created?: IsoDateString
	id: string
	slug: string
	thumbnail?: string
	title?: string
	updated?: IsoDateString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type WishlistsRecord = {
	created?: IsoDateString
	id: string
	products: RecordIdString
	updated?: IsoDateString
	users: RecordIdString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type FeaturedCategoriesResponse<Texpand = unknown> = Required<FeaturedCategoriesRecord> & BaseSystemFields<Texpand>
export type FeaturedProductsResponse<Texpand = unknown> = Required<FeaturedProductsRecord> & BaseSystemFields<Texpand>
export type FeaturedSeriesResponse<Texpand = unknown> = Required<FeaturedSeriesRecord> & BaseSystemFields<Texpand>
export type ImagesResponse<Texpand = unknown> = Required<ImagesRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Ttags = unknown, Texpand = unknown> = Required<ProductsRecord<Ttags>> & BaseSystemFields<Texpand>
export type PromotedProductsResponse<Texpand = unknown> = Required<PromotedProductsRecord> & BaseSystemFields<Texpand>
export type SeriesResponse<Texpand = unknown> = Required<SeriesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type WishlistsResponse<Texpand = unknown> = Required<WishlistsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	categories: CategoriesRecord
	comments: CommentsRecord
	featuredCategories: FeaturedCategoriesRecord
	featuredProducts: FeaturedProductsRecord
	featuredSeries: FeaturedSeriesRecord
	images: ImagesRecord
	products: ProductsRecord
	promotedProducts: PromotedProductsRecord
	series: SeriesRecord
	users: UsersRecord
	wishlists: WishlistsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	categories: CategoriesResponse
	comments: CommentsResponse
	featuredCategories: FeaturedCategoriesResponse
	featuredProducts: FeaturedProductsResponse
	featuredSeries: FeaturedSeriesResponse
	images: ImagesResponse
	products: ProductsResponse
	promotedProducts: PromotedProductsResponse
	series: SeriesResponse
	users: UsersResponse
	wishlists: WishlistsResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'featuredCategories'): RecordService<FeaturedCategoriesResponse>
	collection(idOrName: 'featuredProducts'): RecordService<FeaturedProductsResponse>
	collection(idOrName: 'featuredSeries'): RecordService<FeaturedSeriesResponse>
	collection(idOrName: 'images'): RecordService<ImagesResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'promotedProducts'): RecordService<PromotedProductsResponse>
	collection(idOrName: 'series'): RecordService<SeriesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'wishlists'): RecordService<WishlistsResponse>
}
