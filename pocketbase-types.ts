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
	Blogs = "blogs",
	Carts = "carts",
	Categories = "categories",
	Comments = "comments",
	FeaturedCategories = "featuredCategories",
	FeaturedProducts = "featuredProducts",
	FeaturedSeries = "featuredSeries",
	HomepageCarousel = "homepageCarousel",
	Images = "images",
	Products = "products",
	PromotedProducts = "promotedProducts",
	Queries = "queries",
	Series = "series",
	ShippingMethods = "shippingMethods",
	Socials = "socials",
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

export type BlogsRecord = {
	aboutAuthor?: string
	author?: RecordIdString
	category: string
	content: HTMLString
	cover: RecordIdString
	created?: IsoDateString
	id: string
	images?: RecordIdString[]
	publishedAt: IsoDateString
	slug: string
	summary: string
	title: string
	updated?: IsoDateString
}

export type CartsRecord = {
	amount: number
	completed?: boolean
	created?: IsoDateString
	id: string
	products: RecordIdString
	updated?: IsoDateString
	users: RecordIdString
}

export type CategoriesRecord = {
	created?: IsoDateString
	description?: string
	id: string
	priority?: number
	slug: string
	thumbnail?: RecordIdString
	title: string
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
	tagLine: string
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
	tagLine: string
	updated?: IsoDateString
}

export type HomepageCarouselRecord = {
	buttonText?: string
	created?: IsoDateString
	id: string
	images: RecordIdString
	priority: number
	redirectTo?: string
	subtitle?: string
	title1?: string
	title2?: string
	updated?: IsoDateString
}

export type ImagesRecord = {
	created?: IsoDateString
	id: string
	source: string
	title?: string
	updated?: IsoDateString
}

export type ProductsRecord<Ttags = unknown> = {
	buyingPrice?: number
	categories?: RecordIdString
	created?: IsoDateString
	description?: HTMLString
	discount?: number
	id: string
	images?: RecordIdString[]
	inStock?: boolean
	priority: number
	sellingPrice: number
	series?: RecordIdString
	shippingMethods: RecordIdString
	slug: string
	summary?: string
	tags?: null | Ttags
	title: string
	updated?: IsoDateString
}

export type PromotedProductsRecord = {
	created?: IsoDateString
	id: string
	products: RecordIdString
	tagLine: string
	updated?: IsoDateString
}

export type QueriesRecord = {
	answer?: string
	created?: IsoDateString
	id: string
	question: string
	source?: string
	updated?: IsoDateString
	users: RecordIdString
}

export type SeriesRecord = {
	cover?: RecordIdString
	created?: IsoDateString
	id: string
	priority?: number
	slug: string
	thumbnail?: RecordIdString
	title: string
	updated?: IsoDateString
}

export type ShippingMethodsRecord = {
	created?: IsoDateString
	description?: HTMLString
	id: string
	title: string
	updated?: IsoDateString
}

export enum SocialsPlatformOptions {
	"FACEBOOK" = "FACEBOOK",
	"YOUTUBE" = "YOUTUBE",
	"INSTAGRAM" = "INSTAGRAM",
	"WHATSAPP" = "WHATSAPP",
	"TIKTOK" = "TIKTOK",
	"TWITTER" = "TWITTER",
}
export type SocialsRecord = {
	created?: IsoDateString
	id: string
	image: string
	link: string
	platform: SocialsPlatformOptions
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
export type BlogsResponse<Texpand = unknown> = Required<BlogsRecord> & BaseSystemFields<Texpand>
export type CartsResponse<Texpand = unknown> = Required<CartsRecord> & BaseSystemFields<Texpand>
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type CommentsResponse<Texpand = unknown> = Required<CommentsRecord> & BaseSystemFields<Texpand>
export type FeaturedCategoriesResponse<Texpand = unknown> = Required<FeaturedCategoriesRecord> & BaseSystemFields<Texpand>
export type FeaturedProductsResponse<Texpand = unknown> = Required<FeaturedProductsRecord> & BaseSystemFields<Texpand>
export type FeaturedSeriesResponse<Texpand = unknown> = Required<FeaturedSeriesRecord> & BaseSystemFields<Texpand>
export type HomepageCarouselResponse<Texpand = unknown> = Required<HomepageCarouselRecord> & BaseSystemFields<Texpand>
export type ImagesResponse<Texpand = unknown> = Required<ImagesRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Ttags = unknown, Texpand = unknown> = Required<ProductsRecord<Ttags>> & BaseSystemFields<Texpand>
export type PromotedProductsResponse<Texpand = unknown> = Required<PromotedProductsRecord> & BaseSystemFields<Texpand>
export type QueriesResponse<Texpand = unknown> = Required<QueriesRecord> & BaseSystemFields<Texpand>
export type SeriesResponse<Texpand = unknown> = Required<SeriesRecord> & BaseSystemFields<Texpand>
export type ShippingMethodsResponse<Texpand = unknown> = Required<ShippingMethodsRecord> & BaseSystemFields<Texpand>
export type SocialsResponse<Texpand = unknown> = Required<SocialsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>
export type WishlistsResponse<Texpand = unknown> = Required<WishlistsRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	blogs: BlogsRecord
	carts: CartsRecord
	categories: CategoriesRecord
	comments: CommentsRecord
	featuredCategories: FeaturedCategoriesRecord
	featuredProducts: FeaturedProductsRecord
	featuredSeries: FeaturedSeriesRecord
	homepageCarousel: HomepageCarouselRecord
	images: ImagesRecord
	products: ProductsRecord
	promotedProducts: PromotedProductsRecord
	queries: QueriesRecord
	series: SeriesRecord
	shippingMethods: ShippingMethodsRecord
	socials: SocialsRecord
	users: UsersRecord
	wishlists: WishlistsRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	blogs: BlogsResponse
	carts: CartsResponse
	categories: CategoriesResponse
	comments: CommentsResponse
	featuredCategories: FeaturedCategoriesResponse
	featuredProducts: FeaturedProductsResponse
	featuredSeries: FeaturedSeriesResponse
	homepageCarousel: HomepageCarouselResponse
	images: ImagesResponse
	products: ProductsResponse
	promotedProducts: PromotedProductsResponse
	queries: QueriesResponse
	series: SeriesResponse
	shippingMethods: ShippingMethodsResponse
	socials: SocialsResponse
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
	collection(idOrName: 'blogs'): RecordService<BlogsResponse>
	collection(idOrName: 'carts'): RecordService<CartsResponse>
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'comments'): RecordService<CommentsResponse>
	collection(idOrName: 'featuredCategories'): RecordService<FeaturedCategoriesResponse>
	collection(idOrName: 'featuredProducts'): RecordService<FeaturedProductsResponse>
	collection(idOrName: 'featuredSeries'): RecordService<FeaturedSeriesResponse>
	collection(idOrName: 'homepageCarousel'): RecordService<HomepageCarouselResponse>
	collection(idOrName: 'images'): RecordService<ImagesResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'promotedProducts'): RecordService<PromotedProductsResponse>
	collection(idOrName: 'queries'): RecordService<QueriesResponse>
	collection(idOrName: 'series'): RecordService<SeriesResponse>
	collection(idOrName: 'shippingMethods'): RecordService<ShippingMethodsResponse>
	collection(idOrName: 'socials'): RecordService<SocialsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
	collection(idOrName: 'wishlists'): RecordService<WishlistsResponse>
}
