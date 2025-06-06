/*v3.20.2

*/
// Dependencies for this module:
//   ../../../@akashic/game-configuration
//   ../../../@akashic/pdi-types
//   ../../../@akashic/playlog
//   ../../../@akashic/trigger
//   ../../../@akashic/game-configuration/lib/utils/PathUtil

declare namespace g {
    import { Game } from "g/lib/Game";
    
    /**
        * スクリプトアセット内で参照可能な値。
        * スクリプトアセットを実行した `Game` を表す。
        */
    export const game: Game;
    
    /**
        * スクリプトアセット内で参照可能な値。
        * スクリプトアセットのファイルパスのうち、ディレクトリ部分を表す。
        */
    export const dirname: string;
    
    /**
        * スクリプトアセット内で参照可能な値。
        * スクリプトアセットのファイルパス。
        */
    export const filename: string;
    
    export * from "g/lib";
    
    export as namespace g;
}

declare module 'g/lib/Game' {
    import type { GameConfiguration } from "@akashic/game-configuration";
    import type { Asset, CommonOffset, CommonSize, Renderer, ResourceFactory, ScriptAssetRuntimeValueBase, PlatformPointEvent, OperationPluginViewInfo } from "@akashic/pdi-types";
    import type * as pl from "@akashic/playlog";
    import { Trigger } from "@akashic/trigger";
    import { AssetAccessor } from "g/lib/AssetAccessor";
    import { AssetManager } from "g/lib/AssetManager";
    import { AudioSystemManager } from "g/lib/AudioSystemManager";
    import type { Camera } from "g/lib/Camera";
    import type { E, PointSource, PointDownEvent, PointMoveEvent, PointUpEvent } from "g/lib/entities/E";
    import type { Event, JoinEvent, LeaveEvent, SeedEvent, PlayerInfoEvent, MessageEvent, OperationEvent } from "g/lib/Event";
    import { EventConverter } from "g/lib/EventConverter";
    import type { EventFilter } from "g/lib/EventFilter";
    import type { GameHandlerSet } from "g/lib/GameHandlerSet";
    import type { GameMainParameterObject } from "g/lib/GameMainParameterObject";
    import { InitialScene } from "g/lib/InitialScene";
    import { LoadingScene } from "g/lib/LoadingScene";
    import type { LocalTickModeString } from "g/lib/LocalTickModeString";
    import { ModuleManager } from "g/lib/ModuleManager";
    import type { OperationPlugin } from "g/lib/OperationPlugin";
    import { OperationPluginManager } from "g/lib/OperationPluginManager";
    import type { InternalOperationPluginOperation } from "g/lib/OperationPluginOperation";
    import { PointEventResolver } from "g/lib/PointEventResolver";
    import type { RandomGenerator } from "g/lib/RandomGenerator";
    import type { Scene } from "g/lib/Scene";
    import type { SnapshotSaveRequest } from "g/lib/SnapshotSaveRequest";
    import { SurfaceAtlasSet } from "g/lib/SurfaceAtlasSet";
    import type { TickGenerationModeString } from "g/lib/TickGenerationModeString";
    import { WeakRefKVS } from "g/lib/WeakRefKVS";
    export interface GameResetParameterObject {
            /**
                * `Game#age` に設定する値。
                * 省略された場合、元の値が維持される。
                */
            age?: number;
            /**
                * `Game#_idx` に設定する値。
                * 省略された場合、元の値が維持される。
                */
            nextEntityId?: number;
            /**
                * `Game#random` に設定するシード値。
                * 省略された場合、元の値が維持される。
                */
            randSeed?: number;
            /**
                * 乱数生成器のシリアリゼーション。
                * 省略された場合、元の値が維持される。
                */
            randGenSer?: any;
    }
    export interface EventTriggerMap {
            unknown: undefined;
            timestamp: undefined;
            join: Trigger<JoinEvent>;
            leave: Trigger<LeaveEvent>;
            "player-info": Trigger<PlayerInfoEvent>;
            seed: Trigger<SeedEvent>;
            message: Trigger<MessageEvent>;
            "point-down": Trigger<PointDownEvent>;
            "point-move": Trigger<PointMoveEvent>;
            "point-up": Trigger<PointUpEvent>;
            operation: Trigger<OperationEvent>;
    }
    /**
        * Game#pushScene() のオプション
        */
    export interface PushSceneOption {
            /**
                * 現在のシーンのアセット読み込み後、任意の非同期処理を行うためのハンドラ。
                * prepare 中にシーンスタックを操作してはいけない点に注意。
                *
                * 実装の都合のため、prepare を指定したシーンのロード中は画面描画が行われない。
                * ローディングシーンの描画が重要になるような大規模なゲームの場合、開発者自身で prepare 相当の処理を行うローカルシーンを作成する必要がある。
                */
            prepare?: (done: () => void) => void;
    }
    /**
        * Game#replaceScene() のオプション
        */
    export interface ReplaceSceneOption {
            /**
                * 現在のシーンを破棄するか否か。
                */
            preserveCurrent?: boolean;
            /**
                * 現在のシーンのアセット読み込み後、任意の非同期処理を行うためのハンドラ。
                * prepare 中にシーンスタックを操作してはいけない点に注意。
                *
                * 実装の都合のため、prepare を指定したシーンのロード中は画面描画が行われない。
                * ローディングシーンの描画が重要になるような大規模なゲームの場合、開発者自身で prepare 相当の処理を行うローカルシーンを作成する必要がある。
                */
            prepare?: (done: () => void) => void;
    }
    export type GameMainFunction = (g: any, args: GameMainParameterObject) => void;
    /**
        * `Game` のコンストラクタに渡すことができるパラメータ。
        */
    export interface GameParameterObject {
            /**
                * require("@akashic/akashic-engine") により得られる値。
                * この値はスクリプトアセットの実行時に `g` のグローバル変数の基底として利用される。
                * (モジュールの仕様上この値を `g.Game` 自身が生成するのが難しいため、外部から与えている)
                * TODO: 変数名の検討
                */
            engineModule: any;
            /**
                * この `Game` の設定。典型的には game.json の内容をパースしたものを期待する
                */
            configuration: GameConfiguration;
            /**
                * この `Game` が用いる、リソースのファクトリ
                */
            resourceFactory: ResourceFactory;
            /**
                * この `Game` が用いるハンドラセット
                */
            handlerSet: GameHandlerSet;
            /**
                * アセットのパスの基準となるディレクトリ。
                * @default ""
                */
            assetBase?: string;
            /**
                * このゲームを実行するユーザのID。
                * @default undefined
                */
            selfId?: string;
            /**
                * このゲームの操作プラグインに与えるviewの情報。
                * @default undefined
                */
            operationPluginViewInfo?: OperationPluginViewInfo;
            /**
                * エントリポイントの関数。
                * この値が指定された場合 `GameConfiguration#main` の値は無視される。
                * @default undefined
                */
            mainFunc?: GameMainFunction;
    }
    /**
        * コンテンツそのものを表すクラス。
        *
        * 本クラスのインスタンスは暗黙に生成され、ゲーム開発者が生成することはない。
        * ゲーム開発者は `g.game` によって本クラスのインスタンスを参照できる。
        *
        * 本クラスをゲーム開発者が利用するのは以下のようなケースである。
        * 1. Sceneの生成時、コンストラクタに引数として渡す
        * 2. Sceneに紐付かないイベント Game#join, Game#leave, Game#playerInfo, Game#seed を処理する
        * 3. 乱数を発生させるため、Game#randomにアクセスしRandomGeneratorを取得する
        * 4. ゲームのメタ情報を確認するため、Game#width, Game#height, Game#fpsにアクセスする
        * 5. グローバルアセットを取得するため、Game#assetsにアクセスする
        * 6. LoadingSceneを変更するため、Game#loadingSceneにゲーム開発者の定義したLoadingSceneを指定する
        * 7. スナップショットに対応するため、Game#requestSaveSnapshot()を呼び出す
        * 8. 現在フォーカスされているCamera情報を得るため、Game#focusingCameraにアクセスする
        * 9. AudioSystemを直接制御するため、Game#audioにアクセスする
        * 10.Sceneのスタック情報を調べるため、Game#scenesにアクセスする
        * 11.操作プラグインを直接制御するため、Game#operationPluginManagerにアクセスする
        */
    export class Game {
            /**
                * このコンテンツに関連付けられるエンティティ。(ローカルなエンティティを除く)
                */
            db: WeakRefKVS<E>;
            /**
                * このコンテンツを描画するためのオブジェクト群。
                */
            renderers: Renderer[];
            /**
                * シーンのスタック。
                */
            scenes: Scene[];
            /**
                * このGameで利用可能な乱数生成器。
                */
            random: RandomGenerator;
            /**
                * このGameで利用可能なローカル処理用の乱数生成器。
                */
            localRandom: RandomGenerator;
            /**
                * プレイヤーがゲームに参加したことを表すイベント。
                */
            onJoin: Trigger<JoinEvent>;
            /**
                * プレイヤーがゲームから離脱したことを表すイベント。
                */
            onLeave: Trigger<LeaveEvent>;
            /**
                * 新しいプレイヤー情報が発生したことを示すイベント。
                */
            onPlayerInfo: Trigger<PlayerInfoEvent>;
            /**
                * 新しい乱数シードが発生したことを示すイベント。
                */
            onSeed: Trigger<SeedEvent>;
            /**
                * このコンテンツの累計経過時間。
                * 通常は `this.scene().local` が偽である状態で `tick()` の呼ばれた回数だが、シーン切り替え時等 `tick()` が呼ばれた時以外で加算される事もある。
                */
            age: number;
            /**
                * フレーム辺りの時間経過間隔。初期値は30である。
                */
            fps: number;
            /**
                * ゲーム画面の幅。
                */
            width: number;
            /**
                * ゲーム画面の高さ。
                */
            height: number;
            /**
                * アセットへのアクセッサ。
                * `g.Scene#asset` はこの値のエイリアスである。
                *
                * 歴史的経緯による `assets` との違いに注意。
                * `assets` はグローバルアセットをアセットIDをキーにしてアクセスするテーブルである。
                * 他方この `asset` は `getImageById()`, `getAllTexts()` などのメソッドを持つオブジェクトである。
                * アセットIDだけでなくパスでのアクセスや、複数アセットの一括取得ができる点で異なる。
                */
            asset: AssetAccessor;
            /**
                * グローバルアセットのマップ。this._initialScene.assets のエイリアス。
                */
            assets: {
                    [key: string]: Asset;
            };
            /**
                * グローバルアセットが読み込み済みの場合真。でなければ偽。
                */
            isLoaded: boolean;
            /**
                * アセットのロード中に表示するシーン。
                * ゲーム開発者はこの値を書き換えることでローディングシーンを変更してよい。
                */
            loadingScene: LoadingScene;
            /**
                * Assetの読み込みに使うベースパス。
                * ゲーム開発者が参照する必要はない。
                * 値はプラットフォーム由来のパス(絶対パス)とゲームごとの基準パス(相対パス)をつないだものになる。
                */
            assetBase: string;
            /**
                * このゲームを実行している「自分」のID。
                *
                * この値は、 `Game#join` で渡される `Player` のフィールド `id` と等価性を比較できる値である。
                * すなわちゲーム開発者は、join してきた`Player`の `id` とこの値を比較することで、
                * このゲームのインスタンスを実行している「自分」が参加者であるか否かを決定することができる。
                *
                * この値は必ずしも常に存在するとは限らないことに注意。存在しない場合、 `undefined` である。
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            selfId: string | undefined;
            /**
                * 本ゲームで利用可能なオーディオシステム群。musicとsoundが登録されている。
                */
            audio: AudioSystemManager;
            /**
                * デフォルトで利用されるオーディオシステムのID。デフォルト値はsound。
                */
            defaultAudioSystemId: "music" | "sound";
            /**
                * スナップショット要求通知。
                *
                * 実行環境がコンテンツにスナップショット保存を促す場合に通知される。
                * その頻度やタイミングは実行環境依存である。
                *
                * ただし現実には、任意のタイミングでスナップショットを作成することは難しい。
                * コンテンツはこの通知に関わらず、作成しやすいタイミングでスナップショットを保存するのが望ましい。
                */
            onSnapshotRequest: Trigger<void>;
            /**
                * 外部インターフェース。
                *
                * 実行環境によって、環境依存の値が設定される。
                * ゲーム開発者はこの値を用いる場合、各実行環境のドキュメントを参照すべきである。
                */
            external: any;
            /**
                * 各種リソースのファクトリ。
                */
            resourceFactory: ResourceFactory;
            /**
                * ハンドラセット。
                */
            handlerSet: GameHandlerSet;
            /**
                * ゲーム開発者向けのコンテナ。
                *
                * この値はゲームエンジンのロジックからは使用されず、ゲーム開発者は任意の目的に使用してよい。
                */
            vars: any;
            /**
                * このゲームの各プレイを識別する値。
                *
                * このゲームに複数のプレイヤーがいる場合、すなわち `Game#join` が複数回fireされている場合、各プレイヤー間でこの値は同一である。
                * この値は、特に `game.external` で提供される外部APIに与えるなど、Akashic Engine外部とのやりとりで使われることを想定する値である。
                *
                * 実行中、この値が変化しないことは保証されない。ゲーム開発者はこの値を保持すべきではない。
                * また、この値に応じてゲームの処理や内部状態を変化させるべきではない。
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            playId: string | undefined;
            /**
                * ロードしている操作プラグインを保持するオブジェクト。
                */
            operationPlugins: {
                    [key: number]: OperationPlugin;
            };
            /**
                * 画面サイズの変更時にfireされるTrigger。
                */
            onResized: Trigger<CommonSize>;
            /**
                * スキップ状態の変化時にfireされるTrigger。
                *
                * スキップ状態に遷移する時に真、非スキップ状態に遷移する時に偽が与えられる。
                * この通知は、ゲーム開発者が「スキップ中の演出省略」などの最適化を行うために提供されている。
                *
                * この通知のfire頻度は、ゲームの実行状態などに依存して異なりうることに注意。
                * 例えば多人数プレイされている時、それぞれの環境でfireされ方が異なりうる。
                * ゲーム開発者は、この通知に起因する処理で、ゲームのグローバルな実行状態を変化させてはならない。
                */
            onSkipChange: Trigger<boolean>;
            /**
                * 直近の `update` の通知が、ローカルティックによるものか否か。
                *
                * ただし一度も `update` 通知が起きていない間は真である。
                * ローカルシーンおよびローカルティック補間シーン以外のシーンにおいては、常に偽。
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            isLastTickLocal: boolean;
            /**
                * 直近の `update` の通知時(の直前)に(タイムスタンプ待ちを省略する動作などの影響でエンジンが)省いたローカルティックの数。
                *
                * 一度も `update` 通知が起きていない間は `0` である。
                * ローカルティック補間シーンでない場合、常に `0` であることに注意。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            lastOmittedLocalTickCount: number;
            /**
                * 直近の `Scene#local` の値。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            lastLocalTickMode: LocalTickModeString | null;
            /**
                * 直近の `Scene#tickGenerationMode` の値。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            lastTickGenerationMode: TickGenerationModeString | null;
            /**
                * ゲーム全体で共有するサーフェスアトラス。
                */
            surfaceAtlasSet: SurfaceAtlasSet;
            /**
                * 操作プラグインの管理者。
                */
            operationPluginManager: OperationPluginManager;
            /**
                * `this.scenes` の変化時にfireされるTrigger。
                * このTriggerはアセットロード(Scene#onLoadのfire)を待たず、変化した時点で即fireされることに注意。
                */
            onSceneChange: Trigger<Scene | undefined>;
            /**
                * プレイヤーがゲームに参加したことを表すイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onJoin` を利用すること。
                */
            join: Trigger<JoinEvent>;
            /**
                * プレイヤーがゲームから離脱したことを表すイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onLeave` を利用すること。
                */
            leave: Trigger<LeaveEvent>;
            /**
                * 新しいプレイヤー情報が発生したことを示すイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPlayerInfo` を利用すること。
                */
            playerInfo: Trigger<PlayerInfoEvent>;
            /**
                * 新しい乱数シードが発生したことを示すイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onSeed` を利用すること。
                */
            seed: Trigger<SeedEvent>;
            /**
                * スナップショット要求通知。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onSnapshotRequest` を利用すること。
                */
            snapshotRequest: Trigger<void>;
            /**
                * 画面サイズの変更時にfireされるTrigger。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onResized` を利用すること。
                */
            resized: Trigger<CommonSize>;
            /**
                * スキップ状態の変化時にfireされるTrigger。
                *
                * スキップ状態に遷移する時に真、非スキップ状態に遷移する時に偽が与えられる。
                * この通知は、ゲーム開発者が「スキップ中の演出省略」などの最適化を行うために提供されている。
                *
                * この通知のfire頻度は、ゲームの実行状態などに依存して異なりうることに注意。
                * 例えば多人数プレイされている時、それぞれの環境でfireされ方が異なりうる。
                * ゲーム開発者は、この通知に起因する処理で、ゲームのグローバルな実行状態を変化させてはならない。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onSkipChange` を利用すること。
                */
            skippingChanged: Trigger<boolean>;
            /**
                * ティック消化後にfireされるTrigger。
                */
            onUpdate: Trigger<void>;
            /**
                * ゲームが早送りに状態にあるかどうか。
                *
                * スキップ状態であれば真、非スキップ状態であれば偽である。
                * ゲーム開発者は、この値に起因する処理で、ゲームのグローバルな実行状態を変化させてはならない。
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            isSkipping: boolean;
            /**
                * ゲームにjoinしているプレイヤーIDの一覧。
                *
                * 歴史的経緯により `undefined` は含まれないことに注意。
                * `undefined` は特殊はプレイヤーIDであり通常 join しないため、ゲーム開発者がこの仕様を考慮する必要はない。
                */
            joinedPlayerIds: string[];
            /**
                * イベントとTriggerのマップ。
                * @private
                */
            _eventTriggerMap: EventTriggerMap;
            /**
                * グローバルアセットを読み込むための初期シーン。必ずシーンスタックの一番下に存在する。これをpopScene()することはできない。
                * @private
                */
            _initialScene: InitialScene;
            /**
                * デフォルトローディングシーン。
                *
                * `this.loadingScene` が指定されていない時にローディングシーンとして利用される。
                * また `this.loadingScene` がアセットを利用する場合、その読み込み待ちの間にも利用される。
                *
                * ここに代入される `LoadingScene` はアセットを用いてはならない。
                * 初期値は `new g.DefaultLoadingScene(this)` である。
                * @private
                */
            _defaultLoadingScene: LoadingScene;
            /**
                * デフォルトスキッピングシーン。
                *
                * 初期値は `undefined` である。
                * @private
                */
            _defaultSkippingScene: Scene | undefined;
            /**
                * スキッピングシーン。
                * @private
                */
            _skippingScene: Scene | undefined;
            /**
                * `this.onSceneChange` と同様に `this.scenes` の変化時にfireされるTrigger。
                * `this.onSceneChange` との相違点は `this.reset()` 時に removeAll() されないことである。
                * @private
                */
            _onSceneChange: Trigger<Scene | undefined>;
            /**
                * グローバルアセットの読み込み待ちハンドラ。
                * @private
                */
            _onLoad: Trigger<Game>;
            /**
                * _handleLoad() 呼び出しから戻る直前を通知するTrigger。
                * エントリポイント実行後のシーン遷移直後にfireされる。
                * このTriggerのfireは一度とは限らないことに注意。_loadAndStart()呼び出しの度に一度fireされる。
                * @private
                */
            _onStart: Trigger<void>;
            /**
                * エントリポイント(mainスクリプト)のパス。
                * @private
                */
            _main: string;
            /**
                * エントリポイントの関数。
                * @ignore
                */
            _mainFunc: GameMainFunction | undefined;
            /**
                * _loadAndStart() に渡された、エントリポイント(mainスクリプト)に渡す引数。
                * @private
                */
            _mainParameter: GameMainParameterObject | undefined;
            /**
                * アセットの管理者。
                * @private
                */
            _assetManager: AssetManager;
            /**
                * モジュールの管理者。
                * @private
                */
            _moduleManager: ModuleManager;
            /**
                * イベントコンバータ。
                * @private
                * @ignore
                */
            _eventConverter: EventConverter;
            /**
                * ポイントイベントの解決モジュール。
                * @private
                * @ignore
                */
            _pointEventResolver: PointEventResolver;
            /**
                * 操作プラグインによる操作を通知するTrigger。
                * @private
                */
            _onOperationPluginOperated: Trigger<InternalOperationPluginOperation>;
            /**
                * `this.db` のlastInsertId。
                * `this.db` が空の場合、0が代入されており、以後インクリメントして利用される。
                * @private
                */
            _idx: number;
            /**
                * このゲームに紐づくローカルなエンティティ (`E#local` が真のもの)
                * @private
                */
            _localDb: WeakRefKVS<E>;
            /**
                * ローカルエンティティ用の `this._idx` 。
                * @private
                */
            _localIdx: number;
            /**
                * 次に生成されるカメラのID。
                * 初期値は 0 であり、以後カメラ生成のたびにインクリメントして利用される。
                * @private
                */
            _cameraIdx: number;
            /**
                * `this.terminateGame()` が呼び出された後か否か。
                * これが真の場合、 `this.tick()` は何も行わない。
                * @private
                */
            _isTerminated: boolean;
            /**
                * 使用中のカメラの実体。
                *
                * focusingCameraがこの値を暗黙的に生成するので、通常ゲーム開発者はこの値を直接指定する必要はない。
                * @private
                */
            _focusingCamera: Camera | undefined;
            /**
                * このゲームの設定(game.json の内容)。
                * @private
                */
            _configuration: GameConfiguration;
            /**
                * このゲームの `ScriptAssetRuntimeValueBase` 。
                * @private
                */
            _runtimeValueBase: ScriptAssetRuntimeValueBase;
            /**
                * 画面更新が必要か否かのフラグ。
                * @private
                */
            _modified: boolean;
            /**
                * グローバルアセットの読み込み待ちハンドラ。
                * @private
                * @deprecated 非推奨である。将来的に削除される。代わりに `_onLoad` を利用すること。
                */
            _loaded: Trigger<Game>;
            /**
                * `this.scenes` の変化時にfireされるTrigger。
                * このTriggerはアセットロード(Scene#onLoadのfire)を待たず、変化した時点で即fireされることに注意。
                * @private
                * @deprecated 非推奨である。将来的に削除される。代わりに `_onSceneChange` を利用すること。
                */
            _sceneChanged: Trigger<Scene | undefined>;
            /**
                * _handleLoad() 呼び出しから戻る直前を通知するTrigger。
                * エントリポイント実行後のシーン遷移直後にfireされる。
                * このTriggerのfireは一度とは限らないことに注意。_loadAndStart()呼び出しの度に一度fireされる。
                * @private
                * @deprecated 非推奨である。将来的に削除される。代わりに `_onStart` を利用すること。
                */
            _started: Trigger<void>;
            /**
                * 操作プラグインによる操作を通知するTrigger。
                * @private
                * @deprecated 非推奨である。将来的に削除される。代わりに `_onOperationPluginOperated` を利用すること。
                */
            _operationPluginOperated: Trigger<InternalOperationPluginOperation>;
            /**
                * 使用中のカメラ。
                *
                * `Game#draw()`, `Game#findPointSource()` のデフォルト値として使用される。
                * この値を変更した場合、変更を描画に反映するためには `Game#modified()` を呼び出す必要がある。
                */
            get focusingCamera(): Camera | undefined;
            set focusingCamera(c: Camera | undefined);
            /**
                * スキッピングシーン。
                * ゲームが早送りとなった際に描画される特殊なシーンであり、以下の制限を持つ。
                *
                * * サポートするシーンの種別は "full-local" のみ
                * * 非グローバルアセットを利用してはならない
                * * シーン内で発生した一切のイベントは処理されない
                * * 早送りが複数回発生した場合でも、対象のシーンの onLoad は2度目以降発火せずにインスタンスが使い回される
                *
                * 初期値は `undefined` である。
                */
            get skippingScene(): Scene | undefined;
            set skippingScene(scene: Scene | undefined);
            /**
                * `Game` のインスタンスを生成する。
                *
                * @param param この `Game` に指定するパラメータ
                */
            constructor(param: GameParameterObject);
            /**
                * シーンスタックへのシーンの追加と、そのシーンへの遷移を要求する。
                *
                * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
                * 実際のシーン遷移は現在のフレームの終わり(Scene#update の fire 後) まで遅延される。
                * このメソッドの呼び出しにより、現在のシーンの `stateChanged` が引数 `"deactive"` でfireされる。
                * その後 `scene.stateChanged` が引数 `"active"` でfireされる。
                * @param scene 遷移後のシーン
                * @param option 遷移時のオプション
                */
            pushScene(scene: Scene, option?: PushSceneOption): void;
            /**
                * 現在のシーンの置き換えを要求する。
                *
                * 現在のシーンをシーンスタックから取り除き、指定のシーンを追加することを要求する。
                * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
                * 実際のシーン遷移は現在のフレームの終わり(Scene#update の fire 後) まで遅延される。
                * 引数 `preserveCurrent` が偽の場合、このメソッドの呼び出しにより現在のシーンは破棄される。
                * またその時 `stateChanged` が引数 `"destroyed"` でfireされる。
                * その後 `scene.stateChanged` が引数 `"active"` でfireされる。
                *
                * @param scene 遷移後のシーン
                * @param preserveCurrent 真の場合、現在のシーンを破棄しない(ゲーム開発者が明示的に破棄せねばならない)。省略された場合、偽
                */
            replaceScene(scene: Scene, preserveCurrent?: boolean): void;
            /**
                * 現在のシーンの置き換えを要求する。
                *
                * @param scene 遷移後のシーン
                * @param option 遷移時のオプション
                */
            replaceScene(scene: Scene, option?: ReplaceSceneOption): void;
            /**
                * シーンスタックから現在のシーンを取り除くことを要求する
                *
                * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
                * 実際のシーン遷移は次のフレームまでに(次のupdateのfireまでに)行われる。
                * 引数 `preserve` が偽の場合、このメソッドの呼び出しにより取り除かれたシーンは全て破棄される。
                * またその時 `stateChanged` が引数 `"destroyed"` でfireされる。
                * その後一つ前のシーンの `stateChanged` が引数 `"active"` でfireされる。
                * また、step数がスタックされているシーンの数以上の場合、例外が投げられる。
                *
                * @param preserve 真の場合、シーンを破棄しない(ゲーム開発者が明示的に破棄せねばならない)。省略された場合、偽
                * @param step 取り除くシーンの数。省略された場合、1
                */
            popScene(preserve?: boolean, step?: number): void;
            /**
                * 現在のシーンを返す。
                * ない場合、 `undefined` を返す。
                */
            scene(): Scene | undefined;
            /**
                * この `Game` の時間経過とそれに伴う処理を行う。
                *
                * 現在の `Scene` に対して `Scene#update` をfireし、 `events` に設定されたイベントを処理する。
                * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
                *
                * 戻り値は呼び出し前後でシーンが変わった(別のシーンに遷移した)場合、真。でなければ偽。
                * @param advanceAge 偽を与えた場合、`this.age` を進めない。
                * @param omittedTickCount タイムスタンプ待ちを省略する動作などにより、(前回の呼び出し以降に)省かれたローカルティックの数。省略された場合、 `0` 。
                * @param events ティックに含ませるイベント。省略された場合、 `undefined` 。
                */
            tick(advanceAge: boolean, omittedTickCount?: number, events?: pl.Event[]): boolean;
            /**
                * このGameを描画する。
                *
                * このゲームに紐づけられた `Renderer` (`this.renderers` に含まれるすべての `Renderer` で、この `Game` の描画を行う。
                * 描画内容に変更がない場合、描画処理がスキップされる点に注意。強制的に描画をする場合は `this.modified()` を呼ぶこと。
                * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
                */
            render(): void;
            /**
                * 対象のポイントイベントのターゲットエンティティ(`PointTarget#target`)を解決し、それを補完した playlog.Event を返す。
                * Down -> Move -> Up とは異なる順番で呼び出された場合 `null` を返す。
                * このメソッドは暗黙に呼び出される。ゲーム開発者がこのメソッドを利用する必要はない。
                * @param e プラットフォームのポイントイベント
                */
            resolvePointEvent(e: PlatformPointEvent): pl.Event | null;
            /**
                * その座標に反応する `PointSource` を返す。
                *
                * 戻り値は、対象が見つかった場合、 `target` に見つかった `E` を持つ `PointSource` である。
                * 対象が見つからなかった場合、 `undefined` である。
                *
                * 戻り値が `undefined` でない場合、その `target` プロパティは次を満たす:
                * - `E#touchable` が真である
                * - カメラ `camera` から可視である中で最も手前にある
                *
                * @param point 対象の座標
                * @param camera 対象のカメラ。指定しなければ `Game.focusingCamera` が使われる
                */
            findPointSource(point: CommonOffset, camera?: Camera): PointSource | undefined;
            /**
                * このGameにエンティティを登録する。
                *
                * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に利用する必要はない。
                * `e.id` が `undefined` である場合、このメソッドの呼び出し後、 `e.id` には `this` に一意の値が設定される。
                * `e.local` が偽である場合、このメソッドの呼び出し後、 `this.db[e.id] === e` が成立する。
                * `e.local` が真である場合、 `e.id` の値は不定である。
                *
                * @param e 登録するエンティティ
                */
            register(e: E): void;
            /**
                * このGameからエンティティの登録を削除する。
                *
                * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に利用する必要はない。
                * このメソッドの呼び出し後、 `this.db[e.id]` は未定義である。
                * @param e 登録を削除するエンティティ
                */
            unregister(e: E): void;
            /**
                * このゲームを終了する。
                *
                * エンジンに対して続行の断念を通知する。
                * このメソッドの呼び出し後、このクライアントの操作要求は送信されない。
                * またこのクライアントのゲーム実行は行われない(updateを含むイベントのfireはおきない)。
                */
            terminateGame(): void;
            /**
                * 画面更新が必要のフラグを設定する。
                */
            modified(): void;
            /**
                * イベントを発生させる。
                *
                * ゲーム開発者は、このメソッドを呼び出すことで、エンジンに指定のイベントを発生させることができる。
                *
                * @param e 発生させるイベント
                */
            raiseEvent(e: Event): void;
            /**
                * ティックを発生させる。
                *
                * ゲーム開発者は、このメソッドを呼び出すことで、エンジンに時間経過を要求することができる。
                * 現在のシーンのティック生成モード `Scene#tickGenerationMode` が `"manual"` でない場合、エラー。
                *
                * @param events そのティックで追加で発生させるイベント
                */
            raiseTick(events?: Event[]): void;
            /**
                * イベントフィルタを追加する。
                *
                * 一つ以上のイベントフィルタが存在する場合、このゲームで発生したイベントは、通常の処理の代わりにイベントフィルタに渡される。
                * エンジンは、イベントフィルタが戻り値として返したイベントを、まるでそのイベントが発生したかのように処理する。
                *
                * イベントフィルタはローカルイベントに対しても適用される。
                * イベントフィルタはローカルティック補間シーンやローカルシーンの間であっても適用される。
                * 複数のイベントフィルタが存在する場合、そのすべてが適用される。適用順は登録の順である。
                *
                * @param filter 追加するイベントフィルタ
                * @param handleEmpty イベントが存在しない場合でも定期的にフィルタを呼び出すか否か。省略された場合、偽。
                */
            addEventFilter(filter: EventFilter, handleEmpty?: boolean): void;
            /**
                * イベントフィルタを削除する。
                *
                * @param filter 削除するイベントフィルタ
                */
            removeEventFilter(filter: EventFilter): void;
            /**
                * このインスタンスにおいてスナップショットの保存を行うべきかを返す。
                *
                * スナップショット保存に対応するゲームであっても、
                * 必ずしもすべてのインスタンスにおいてスナップショット保存を行うべきとは限らない。
                * たとえば多人数プレイ時には、複数のクライアントで同一のゲームが実行される。
                * スナップショットを保存するのはそのうちの一つのインスタンスのみでよい。
                * 本メソッドはそのような場合に、自身がスナップショットを保存すべきかどうかを判定するために用いることができる。
                *
                * スナップショット保存に対応するゲームは、このメソッドが真を返す時にのみ `Game#saveSnapshot()` を呼び出すべきである。
                * 戻り値は、スナップショットの保存を行うべきであれば真、でなければ偽である。
                *
                * @deprecated 非推奨である。`saveSnapshot()` (非推奨) の利用時にしか必要ないため。アクティブインスタンスの判定には `isActiveInstance()` を用いること。
                */
            shouldSaveSnapshot(): boolean;
            /**
                * スナップショットを保存する。
                *
                * このメソッドは `Game#shouldSaveSnapshot()` が真を返す `Game` に対してのみ呼び出されるべきである。
                * そうでない場合、このメソッドの動作は不定である。
                *
                * このメソッドで保存されたスナップショットは、
                * main スクリプト (ゲーム開始時に最初に実行されるスクリプト) の関数に、
                * 引数 (の `snapshot` プロパティ) として与えられる場合がある。
                * (e.g. マルチプレイのゲームプレイ画面を途中から開いた場合)
                * スナップショットが与えられた場合、ゲームはそのスナップショットから保存時の実行状態を復元しなければならない。
                *
                * @param snapshot 保存するスナップショット。JSONとして妥当な値でなければならない。
                * @param timestamp 保存時の時刻。 `g.TimestampEvent` を利用するゲームの場合、それらと同じ基準の時間情報を与えなければならない。
                * @deprecated 非推奨である。互換性のために残されているが、この関数では適切なタイミングのスナップショット保存ができない場合がある。代わりに `requestSaveSnapshot()` を利用すること。
                */
            saveSnapshot(snapshot: any, timestamp?: number): void;
            /**
                * スナップショットを保存する。
                *
                * (`saveSnapshot()` と同じ機能だが、インターフェースが異なる。こちらを利用すること。)
                *
                * 引数として与えた関数 `func()` がフレームの終了時に呼び出される。
                * エンジンは、`func()` の返した値に基づいて、実行環境にスナップショットの保存を要求する。
                *
                * 保存されたスナップショットは、必要に応じてゲームの起動時に与えられる。
                * 詳細は `g.GameMainParameterObject` を参照のこと。
                *
                * このメソッドを 1 フレーム中に複数回呼び出した場合、引数に与えた関数 `func()` の呼び出し順は保証されない。
                * (スナップショットはフレームごとに定まるので、1フレーム中に複数回呼び出す必要はない。)
                *
                * @param func フレーム終了時に呼び出す関数。 `SnapshotSaveRequest` を返した場合、スナップショット保存が要求される。
                * @param owner func の呼び出し時に `this` として使われる値。指定しなかった場合、 `undefined` 。
                */
            requestSaveSnapshot(func: () => SnapshotSaveRequest | null, owner?: any): void;
            /**
                * 現在時刻を取得する。
                *
                * 値は1970-01-01T00:00:00Zからのミリ秒での経過時刻である。
                * `Date.now()` と異なり、この値は消化されたティックの数から算出される擬似的な時刻である。
                */
            getCurrentTime(): number;
            /**
                * このインスタンスがアクティブインスタンスであるかどうか返す。
                *
                * ゲーム開発者は、この値の真偽に起因する処理で、ゲームのローカルな実行状態を変更してはならず、
                * `raiseEvent()` などによって、グローバルな状態を更新する必要がある。
                */
            isActiveInstance(): boolean;
            /**
                * @ignore
                */
            _pushPostTickTask(fun: () => void, owner: any): void;
            /**
                * @ignore
                */
            _popSceneRaw(preserveCurrent: boolean): void;
            /**
                * @private
                */
            _normalizeConfiguration(gameConfiguration: GameConfiguration): GameConfiguration;
            /**
                * @private
                */
            _setAudioPlaybackRate(playbackRate: number): void;
            /**
                * @private
                */
            _startSuppressAudio(): void;
            /**
                * @private
                */
            _endSuppressAudio(): void;
            /**
                * @private
                */
            _setMuted(muted: boolean): void;
            /**
                * g.OperationEventのデータをデコードする。
                * @private
                */
            _decodeOperationPluginOperation(code: number, op: (number | string)[]): any;
            /**
                * ゲーム状態のリセット。
                * @private
                */
            _reset(param?: GameResetParameterObject): void;
            /**
                * ゲームを破棄する。
                * エンジンユーザとコンテンツに開放された一部プロパティ(external, vars)は維持する点に注意。
                * @private
                */
            _destroy(): void;
            /**
                * ゲームを開始する。
                *
                * 存在するシーンをすべて(_initialScene以外; あるなら)破棄し、グローバルアセットを読み込み、完了後ゲーム開発者の実装コードの実行を開始する。
                * このメソッドの二度目以降の呼び出しの前には、 `this._reset()` を呼び出す必要がある。
                * @param param ゲームのエントリポイントに渡す値
                * @private
                */
            _loadAndStart(param?: GameMainParameterObject): void;
            /**
                * グローバルアセットの読み込みを開始する。
                * 単体テスト用 (mainSceneなど特定アセットの存在を前提にする_loadAndStart()はテストに使いにくい) なので、通常ゲーム開発者が利用することはない
                * @private
                */
            _startLoadingGlobalAssets(): void;
            /**
                * @private
                */
            _updateEventTriggers(scene: Scene | undefined): void;
            /**
                * @private
                */
            _handleInitialSceneLoad(): void;
            /**
                * @ignore
                */
            _handleOperationPluginOperated(op: InternalOperationPluginOperation): void;
            /**
                * @ignore
                */
            _handleSceneChanged(scene?: Scene): void;
            /**
                * @ignore
                */
            _handleSkippingSceneReady(scene: Scene): void;
            /**
                * @private
                */
            _terminateGame(): void;
            /**
                * post-tick タスクを実行する。
                *
                * `pushScene()` などのシーン遷移や `_pushPostTickTask()` によって要求された post-tick タスクを実行する。
                * 通常このメソッドは、毎フレーム一度、フレームの最後に呼び出されることを期待する (`Game#tick()` がこの呼び出しを行う)。
                * ただしゲーム開始時 (グローバルアセット読み込み・スナップショットローダ起動後またはmainScene実行開始時) に関しては、
                * シーン追加がゲーム開発者の記述によらない (`tick()` の外側である) ため、それぞれの箇所で明示的にこのメソッドを呼び出す。
                * @private
                */
            _flushPostTickTasks(): void;
            /**
                * @ignore
                */
            _handleSkipChange(isSkipping: boolean): void;
            /**
                * @ignore
                */
            _handleJoinEvent(event: JoinEvent): void;
            /**
                * @ignore
                */
            _handleLeaveEvent(event: LeaveEvent): void;
    }
}

declare module 'g/lib' {
    export * from "g/lib/index.common";
    export * from "g/lib/GameHandlerSet";
}

declare module 'g/lib/AssetAccessor' {
    import type { AudioAsset, BinaryAsset, ImageAsset, ScriptAsset, TextAsset, VectorImageAsset } from "@akashic/pdi-types";
    import type { AssetManager } from "g/lib/AssetManager";
    /**
        * アセットへのアクセスを提供するアクセッサ群。
        *
        * 実態は `AssetManager` のいくつかのメソッドに対するラッパーである。
        * このクラスにより、パス・アセットID・パターン・フィルタから、対応する読み込み済みアセットを取得できる。
        *
        * 通常、ゲーム開発者はこのクラスのオブジェクトを生成する必要はない。
        * `g.Scene#asset` に代入されている値を利用すればよい。
        */
    export class AssetAccessor {
            /**
                * `AssetAccessor` のインスタンスを生成する。
                *
                * @param assetManager ラップする `AssetManager`
                */
            constructor(assetManager: AssetManager);
            /**
                * パスから読み込み済みの画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該の画像アセットが読み込まれていない場合、エラー。
                *
                * @param path 取得する画像アセットのパス
                */
            getImage(path: string): ImageAsset;
            /**
                * パスから読み込み済みのオーディオアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * さらにオーディオアセットに限り、拡張子を省いたものでなければならない。(e.g. `"/audio/bgm01"`)
                *
                * 当該のオーディオアセットが読み込まれていない場合、エラー。
                *
                * @param path 取得するオーディオアセットのパス
                */
            getAudio(path: string): AudioAsset;
            /**
                * パスから読み込み済みのスクリプトアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のスクリプトアセットが読み込まれていない場合、エラー。
                *
                * @param path 取得するスクリプトアセットのパス
                */
            getScript(path: string): ScriptAsset;
            /**
                * パスから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param path 取得するテキストアセットのパス
                */
            getText(path: string): TextAsset;
            /**
                * パスから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容の文字列を返す。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param path 内容の文字列を取得するテキストアセットのパス
                */
            getTextContent(path: string): string;
            /**
                * パスから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容をJSONとしてパースした値を返す。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param path 内容のJSONを取得するテキストアセットのパス
                */
            getJSONContent(path: string): any;
            /**
                * パスから読み込み済みのベクタ画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のベクタ画像アセットが読み込まれていない場合、エラー。
                *
                * @param path 取得する画像アセットのパス
                */
            getVectorImage(path: string): VectorImageAsset;
            /**
                * パスから読み込み済みのバイナリアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のバイナリアセットが読み込まれていない場合、エラー。
                *
                * @param path 取得するバイナリアセットのパス
                */
            getBinary(path: string): BinaryAsset;
            /**
                * パスから読み込み済みのバイナリアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容のバイト配列を返す。
                *
                * パスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスでなければならない。
                * 当該のバイナリアセットが読み込まれていない場合、エラー。
                *
                * @param path 内容のバイト配列を取得するバイナリアセットのパス
                */
            getBinaryData(path: string): ArrayBuffer;
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                *
                * ここでパスはgame.jsonのあるディレクトリをルート (`/`) とする、 `/` 区切りの絶対パスである。
                *
                * パターンは、パス文字列、またはパス中に0個以上の `**`, `*`, `?` を含む文字列である。
                * ここで `**` は0個以上の任意のディレクトリを、 `*` は0個以上の `/` でない文字を、
                * `?` は1個の `/` でない文字を表す。 (e.g. "/images/monsters??/*.png")
                *
                * フィルタは、パスを受け取ってbooleanを返す関数である。
                * フィルタを与えた場合、読み込み済みの全アセットのうち、フィルタが偽でない値を返したものを返す。
                *
                * @param patternOrFilter 取得する画像アセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllImages(patternOrFilter?: string | ((path: string) => boolean)): ImageAsset[];
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全オーディオアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
                * ただしオーディオアセットに限り、拡張子を省いたものでなければならない。(e.g. `"/audio/bgm*"`)
                *
                * @param patternOrFilter 取得するオーディオアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllAudios(patternOrFilter?: string | ((path: string) => boolean)): AudioAsset[];
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全スクリプトアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
                *
                * @param patternOrFilter 取得するスクリプトアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllScripts(patternOrFilter?: string | ((path: string) => boolean)): ScriptAsset[];
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全テキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
                *
                * @param patternOrFilter 取得するテキストアセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllTexts(patternOrFilter?: string | ((path: string) => boolean)): TextAsset[];
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みの全ベクタ画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
                *
                * @param patternOrFilter 取得するベクタ画像アセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllVectorImages(patternOrFilter?: string | ((path: string) => boolean)): VectorImageAsset[];
            /**
                * 与えられたパターンまたはフィルタにマッチするパスを持つ、読み込み済みのバイナリアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 引数の仕様については `AssetAccessor#getAllImages()` の仕様を参照のこと。
                *
                * @param patternOrFilter 取得するベクタ画像アセットのパスパターンまたはフィルタ。省略した場合、読み込み済みの全て
                */
            getAllBinaries(patternOrFilter?: string | ((path: string) => boolean)): BinaryAsset[];
            /**
                * アセットIDから読み込み済みの画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該の画像アセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得する画像アセットのID
                */
            getImageById(assetId: string): ImageAsset;
            /**
                * アセットIDから読み込み済みのオーディオアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該のオーディオアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するオーディオアセットのID
                */
            getAudioById(assetId: string): AudioAsset;
            /**
                * アセットIDから読み込み済みのスクリプトアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該のスクリプトアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するスクリプトアセットのID
                */
            getScriptById(assetId: string): ScriptAsset;
            /**
                * アセットIDから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するテキストアセットのID
                */
            getTextById(assetId: string): TextAsset;
            /**
                * アセットIDから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容の文字列を返す。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 内容の文字列を取得するテキストアセットのID
                */
            getTextContentById(assetId: string): string;
            /**
                * アセットIDから読み込み済みのテキストアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容をJSONとしてパースして返す。
                * 当該のテキストアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 内容のJSONを取得するテキストアセットのID
                */
            getJSONContentById(assetId: string): any;
            /**
                * アセットIDから読み込み済みのベクタ画像アセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該のベクタ画像アセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するベクタ画像アセットのID
                */
            getVectorImageById(assetId: string): VectorImageAsset;
            /**
                * アセットIDから読み込み済みのバイナリアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得する。
                * 当該のバイナリアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するバイナリアセットのID
                */
            getBinaryById(assetId: string): BinaryAsset;
            /**
                * アセットIDから読み込み済みのバイナリアセット（現在のシーンで読み込んだ、またはグローバルなアセット）を取得し、その内容のバイト配列を返す。
                * 当該のバイナリアセットが読み込まれていない場合、エラー。
                *
                * @param assetId 取得するバイナリアセットのID
                */
            getBinaryDataById(assetId: string): ArrayBuffer;
            /**
                * アセットIDからアセットのパスを返す。
                * 当該のアセットが読み込まれていない場合、 null を返す。
                *
                * @param assetId 取得するアセットのID
                */
            pathOf(assetId: string): string | null;
    }
}

declare module 'g/lib/AssetManager' {
    import type { AssetConfigurationMap, AudioSystemConfigurationMap, ModuleMainScriptsMap, AssetConfigurationCommonBase, ImageAssetConfigurationBase, ScriptAssetConfigurationBase, TextAssetConfigurationBase, AudioAssetConfigurationBase, VideoAssetConfigurationBase, VectorImageAssetConfigurationBase, BinaryAssetConfigurationBase, ModuleMainPathsMap, AssetBundleConfiguration } from "@akashic/game-configuration";
    import type { Asset, AssetLoadHandler, AudioAsset, AssetLoadError, ImageAsset, ResourceFactory, ScriptAsset, TextAsset, VideoAsset, VectorImageAsset, BinaryAsset } from "@akashic/pdi-types";
    import type { AssetGenerationConfiguration } from "g/lib/AssetGenerationConfiguration";
    import type { AssetManagerLoadHandler } from "g/lib/AssetManagerLoadHandler";
    import type { AudioSystem } from "g/lib/AudioSystem";
    import type { AudioSystemManager } from "g/lib/AudioSystemManager";
    import type { DynamicAssetConfiguration } from "g/lib/DynamicAssetConfiguration";
    export type OneOfAsset = AudioAsset | ImageAsset | ScriptAsset | TextAsset | VideoAsset | VectorImageAsset | BinaryAsset;
    type AssetConfigurationCore = ImageAssetConfiguration | VectorImageAssetConfiguration | VideoAssetConfiguration | AudioAssetConfiguration | TextAssetConfiguration | ScriptAssetConfiguration | BinaryAssetConfiguration;
    type UnneededKeysForAsset = "path" | "virtualPath" | "global";
    interface ImageAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<ImageAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface VectorImageAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<VectorImageAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface VideoAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<VideoAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface AudioAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<AudioAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface TextAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<TextAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface ScriptAssetConfiguration extends Omit<AssetConfigurationCommonBase, "type">, Omit<ScriptAssetConfigurationBase, UnneededKeysForAsset> {
    }
    interface BinaryAssetConfiguration extends Omit<BinaryAssetConfigurationBase, "type">, Omit<BinaryAssetConfigurationBase, UnneededKeysForAsset> {
    }
    export type AssetIdOrConf = string | DynamicAssetConfiguration | AssetGenerationConfiguration;
    export interface AssetManagerParameterGameLike {
            resourceFactory: ResourceFactory;
            audio: AudioSystemManager;
            defaultAudioSystemId: "music" | "sound";
    }
    /**
        * `Asset` を管理するクラス。
        *
        * このクラスのインスタンスは `Game` に一つデフォルトで存在する(デフォルトアセットマネージャ)。
        * デフォルトアセットマネージャは、game.json に記述された通常のアセットを読み込むために利用される。
        *
        * ゲーム開発者は、game.json に記述のないリソースを取得するために、このクラスのインスタンスを独自に生成してよい。
        */
    export class AssetManager implements AssetLoadHandler {
            static MAX_ERROR_COUNT: number;
            /**
                * コンストラクタに渡されたアセットの設定。(assets.json が入っていることが期待される)
                */
            configuration: AssetConfigurationMap;
            /**
                * require解決用の仮想パスからアセットIDを引くためのテーブル。
                * @private
                */
            _virtualPathToIdTable: {
                    [key: string]: string;
            };
            /**
                * 読み込み済みのアセット。
                * requestAssets() で読み込みをリクエストしたゲーム開発者はコールバックでアセットを受け取るので、この変数を参照する必要は通常ない
                * @private
                */
            _assets: {
                    [key: string]: OneOfAsset;
            };
            /**
                * 読み込み済みのrequire解決用の仮想パスからアセットを引くためのテーブル。
                * アセットIDと異なり、ファイルパスは重複しうる (同じ画像を複数の名前で参照することはできる) ので、要素数は `_assets` 以下である。
                * この情報は逆引き用の補助的な値にすぎない。このクラスの読み込み済みアセットの管理はすべて `_assets` 経由で行う。
                * @private
                */
            _liveAssetVirtualPathTable: {
                    [key: string]: OneOfAsset;
            };
            /**
                * 読み込み済みのアセットの絶対パスからrequire解決用の仮想パスを引くためのテーブル。
                * @private
                */
            _liveAssetPathTable: {
                    [path: string]: string;
            };
            /**
                * requireの第一引数から対応する仮想パスを引くためのテーブル。
                * @private
                */
            _moduleMainScripts: ModuleMainScriptsMap;
            /**
                * package.json のパスをキーに、その main フィールドの内容を値に持つテーブル
                * @private
                */
            _moduleMainPaths: ModuleMainPathsMap | null;
            /**
                * 各アセットに対する参照の数。
                * 参照は requestAssets() で増え、unrefAssets() で減る。
                * なおロード中であっても参照に数える。つまり (this._refCounts[id] > 1) であるなら !!(this._assets[id] || this._loadings[id])
                * @private
                */
            _refCounts: {
                    [key: string]: number;
            };
            /**
                * `AssetManager` のインスタンスを生成する。
                *
                * @param gameParams このインスタンスが属するゲーム。
                * @param conf このアセットマネージャに与えるアセット定義。game.json の `"assets"` に相当。
                * @param audioSystemConfMap このアセットマネージャに与えるオーディオシステムの宣言。
                * @param moduleMainScripts このアセットマネージャに与える require() 解決用のエントリポイント。
                */
            constructor(gameParams: AssetManagerParameterGameLike, conf?: AssetConfigurationMap, audioSystemConfMap?: AudioSystemConfigurationMap, moduleMainScripts?: ModuleMainScriptsMap, moduleMainPaths?: ModuleMainPathsMap);
            /**
                * このインスタンスを破棄する。
                */
            destroy(): void;
            /**
                * このインスタンスが破棄済みであるかどうかを返す。
                */
            destroyed(): boolean;
            /**
                * `Asset` の読み込みを再試行する。
                *
                * 引数 `asset` は読み込みの失敗が (`Scene#assetLoadFail` で) 通知されたアセットでなければならない。
                * @param asset 読み込みを再試行するアセット
                */
            retryLoad(asset: Asset): void;
            /**
                * グローバルアセットのIDを全て返す。
                */
            globalAssetIds(): string[];
            /**
                * プリロードすべきスクリプトアセットの path を全て返す。
                */
            preloadScriptAssetPaths(): string[];
            /**
                * パターンまたはフィルタに合致するパスを持つアセットIDを全て返す。
                *
                * 戻り値は読み込み済みでないアセットのIDを含むことに注意。
                * 読み込み済みのアセットにアクセスする場合は、 `peekAllLiveAssetsByPattern()` を利用すること。
                *
                * @param patternOrFilters パターンまたはフィルタ。仕様は `AssetAccessor#getAllImages()` を参照
                */
            resolvePatternsToAssetIds(patternOrFilters: (string | ((accessorPath: string) => boolean))[]): string[];
            /**
                * アセットの取得を要求する。
                *
                * 要求したアセットが読み込み済みでない場合、読み込みが行われる。
                * 取得した結果は `handler` を通して通知される。
                * ゲーム開発者はこのメソッドを呼び出してアセットを取得した場合、
                * 同じアセットID(または取得したアセット)で `unrefAsset()` を呼び出さなければならない。
                *
                * @param assetIdOrConf 要求するアセットのIDまたは設定
                * @param handler 要求結果を受け取るハンドラ
                */
            requestAsset(assetIdOrConf: AssetIdOrConf, handler: AssetManagerLoadHandler): boolean;
            /**
                * アセットの参照カウントを減らす。
                * 引数の各要素で `unrefAsset()` を呼び出す。
                *
                * @param assetOrId 参照カウントを減らすアセットまたはアセットID
                */
            unrefAsset(assetOrId: string | Asset): void;
            /**
                * 複数のアセットの取得を要求する。
                * 引数の各要素で `requestAsset()` を呼び出す。
                *
                * @param assetIdOrConfs 取得するアセットのIDまたはアセット定義
                * @param handler 取得の結果を受け取るハンドラ
                */
            requestAssets(assetIdOrConfs: AssetIdOrConf[], handler: AssetManagerLoadHandler): number;
            /**
                * 複数のアセットを解放する。
                * 引数の各要素で `unrefAsset()` を呼び出す。
                *
                * @param assetOrIds 参照カウントを減らすアセットまたはアセットID
                * @private
                */
            unrefAssets(assetOrIds: (string | Asset)[]): void;
            /**
                * アクセッサパスで指定された読み込み済みのアセットを返す。
                *
                * ここでアクセッサパスとは、 `AssetAccessor` が使うパス
                * (game.jsonのディレクトリをルート (`/`) とする、 `/` 区切りの絶対パス形式の仮想パス)である。
                * これは `/` を除けばアセットの仮想パス (virtualPath) と同一である。
                *
                * @param accessorPath 取得するアセットのアクセッサパス
                * @param type 取得するアセットのタイプ。対象のアセットと合致しない場合、エラー
                */
            peekLiveAssetByAccessorPath<T extends OneOfAsset>(accessorPath: string, type: T["type"]): T;
            /**
                * アセットIDで指定された読み込み済みのアセットを返す。
                *
                * @param assetId 取得するアセットのID
                * @param type 取得するアセットのタイプ。対象のアセットと合致しない場合、エラー
                */
            peekLiveAssetById<T extends OneOfAsset>(assetId: string, type: T["type"]): T;
            /**
                * パターンまたはフィルタにマッチするパスを持つ、指定されたタイプの全読み込み済みアセットを返す。
                *
                * 戻り値の要素の順序は保証されない。
                * パターンとフィルタについては `AssetAccessor#getAllImages()` の仕様を参照のこと。
                *
                * @param patternOrFilter 取得するアセットのパスパターンまたはフィルタ
                * @param type 取得するアセットのタイプ。 null の場合、全てのタイプとして扱われる。
                */
            peekAllLiveAssetsByPattern<T extends OneOfAsset>(patternOrFilter: string | ((accessorPath: string) => boolean), type: T["type"] | null): T[];
            /**
                * アセットIDから読み込み済みのアクセッサパス返す。
                * 当該のアセットが読み込まれていない場合、 null を返す。
                *
                * @param assetId 取得するアセットのID
                */
            resolveAccessorPath(assetId: string): string | null;
            /**
                * アセットバンドルを設定する。
                *
                * @param assetBundle アセットバンドル
                */
            setAssetBundle(assetBundle: AssetBundleConfiguration | null): void;
            /**
                * @ignore
                */
            _normalize(configuration: AssetConfigurationMap): AssetConfigurationMap;
            /**
                * @private
                * @ignore
                */
            _normalizeAssetBaseDeclaration<T extends AssetConfigurationCore>(assetId: string, conf: T): T;
            /**
                * @private
                */
            _createAssetFor(idOrConf: AssetIdOrConf): OneOfAsset;
            /**
                * @private
                */
            _createGeneratedAssetFor(conf: AssetGenerationConfiguration): OneOfAsset;
            /**
                * @ignore
                */
            _releaseAsset(assetId: string): void;
            /**
                * 現在ロード中のアセットの数。(デバッグ用; 直接の用途はない)
                * @private
                */
            _countLoadingAsset(): number;
            /**
                * @private
                */
            _onAssetError(asset: OneOfAsset, error: AssetLoadError): void;
            /**
                * @private
                */
            _onAssetLoad(asset: OneOfAsset): void;
            /**
                * @private
                */
            _replaceModulePathToAbsolute(accessorPath: string): string;
            /**
                * @private
                */
            _getAudioSystem(assetIdOrConf: AssetIdOrConf): AudioSystem | null;
            /**
                * @private
                */
            _addAssetToTables(asset: OneOfAsset): void;
    }
    export {};
}

declare module 'g/lib/AudioSystemManager' {
    import type { AudioAsset, ResourceFactory } from "@akashic/pdi-types";
    import type { AudioPlayContext } from "g/lib/AudioPlayContext";
    import type { AudioSystem } from "g/lib/AudioSystem";
    /**
        * `AudioSystem` の管理クラス。
        *
        * 複数の `AudioSystem` に一括で必要な状態設定を行う。
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        */
    export class AudioSystemManager {
            /**
                * ループ再生可能な AudioSystem
                */
            music: AudioSystem;
            /**
                * 効果音を扱う AudioSystem
                */
            sound: AudioSystem;
            /**
                * @private
                */
            _muted: boolean;
            /**
                * @private
                */
            _resourceFactory: ResourceFactory;
            constructor(resourceFactory: ResourceFactory);
            /**
                * 対象の音声アセットの AudioPlayContext を生成する。
                *
                * @param asset 音声アセット
                */
            create(asset: AudioAsset): AudioPlayContext;
            /**
                * 対象の音声アセットの AudioPlayContext を生成し、再生する。
                *
                * @param asset 音声アセット
                */
            play(asset: AudioAsset): AudioPlayContext;
            /**
                * @private
                */
            _reset(): void;
            /**
                * @private
                */
            _setMuted(muted: boolean): void;
            /**
                * @private
                */
            _setPlaybackRate(rate: number): void;
            _startSuppress(): void;
            _endSuppress(): void;
            stopAll(): void;
    }
}

declare module 'g/lib/Camera' {
    import type { Renderer } from "@akashic/pdi-types";
    /**
        * カメラを表すインターフェース。
        */
    export interface Camera {
            /**
                * このカメラがローカルであるか否か。
                */
            local: boolean;
            /**
                * @private
                */
            _applyTransformToRenderer: (renderer: Renderer) => void;
            serialize(): any;
    }
}

declare module 'g/lib/entities/E' {
    import type { CommonArea, CommonOffset, CommonRect, Renderer } from "@akashic/pdi-types";
    import type { Trigger } from "@akashic/trigger";
    import type { Camera } from "g/lib/Camera";
    import { EntityStateFlags } from "g/lib/EntityStateFlags";
    import type { MessageEvent, PointSourceBase } from "g/lib/Event";
    import { PointDownEventBase, PointEventBase, PointMoveEventBase, PointUpEventBase } from "g/lib/Event";
    import type { Game } from "g/lib/Game";
    import type { Matrix } from "g/lib/Matrix";
    import type { Object2DParameterObject } from "g/lib/Object2D";
    import { Object2D } from "g/lib/Object2D";
    import type { Scene } from "g/lib/Scene";
    import type { ShaderProgram } from "g/lib/ShaderProgram";
    /**
        * ポインティングソースによって対象となるエンティティを表すインターフェース。
        * エンティティとエンティティから見た相対座標によって構成される。
        */
    export interface PointSource extends PointSourceBase<E> {
    }
    export type PointEvent = PointEventBase<E>;
    /**
        * ポインティング操作の開始を表すイベント。
        */
    export class PointDownEvent extends PointDownEventBase<E> {
    }
    /**
        * ポインティング操作の終了を表すイベント。
        * PointDownEvent後にのみ発生する。
        *
        * PointUpEvent#startDeltaによってPointDownEvent時からの移動量が、
        * PointUpEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
        * PointUpEvent#pointにはPointDownEvent#pointと同じ値が格納される。
        */
    export class PointUpEvent extends PointUpEventBase<E> {
    }
    /**
        * ポインティング操作の移動を表すイベント。
        * PointDownEvent後にのみ発生するため、MouseMove相当のものが本イベントとして発生することはない。
        *
        * PointMoveEvent#startDeltaによってPointDownEvent時からの移動量が、
        * PointMoveEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
        * PointMoveEvent#pointにはPointMoveEvent#pointと同じ値が格納される。
        *
        * 本イベントは、プレイヤーがポインティングデバイスを移動していなくても、
        * カメラの移動等視覚的にポイントが変化している場合にも発生する。
        */
    export class PointMoveEvent extends PointMoveEventBase<E> {
    }
    /**
        * `E` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `E` の同名メンバの説明を参照すること。
        */
    export interface EParameterObject extends Object2DParameterObject {
            /**
                * このエンティティが属するシーン。
                */
            scene: Scene;
            /**
                * このエンティティがローカルであるか否か。
                * コンストラクタで真が指定された時、または属するシーンがローカルシーンまたはローカルティック補間シーンである時、この値は真である。
                *
                * この値が真である場合、このエンティティに対する point イベントはこのゲームインスタンスにのみ通知され、
                * 他の参加者・視聴者には通知されない。また真である場合、 `id` の値の一意性は保証されない。
                * @default false
                */
            local?: boolean;
            /**
                * このエンティティの親
                * @default undefined
                */
            parent?: E | Scene;
            /**
                * このエンティティの全子エンティティ。
                * @default undefined
                */
            children?: E[];
            /**
                * プレイヤーにとって触れられるオブジェクトであるかを表す。
                * この値が偽である場合、ポインティングイベントの対象にならない。
                * @default false
                */
            touchable?: boolean;
            /**
                * このエンティティの表示状態。
                * @default false
                */
            hidden?: boolean;
            /**
                * このエンティティに割り振られる `E#id` の値。
                * エンジンが一意の ID を設定するため、通常指定する必要はない。
                * この値は、スナップショットローダがエンティティを復元する際にのみ指定されるべきである。
                * @default undefined
                */
            id?: number;
            /**
                * ゲーム開発者向けのタグ情報管理コンテナ。
                * この値はゲームエンジンのロジックからは使用されず、ゲーム開発者は任意の目的に使用してよい。
                * @default undefined
                */
            tag?: any;
            /**
                * このエンティティの描画時に利用されるシェーダプログラム。
                * このエンティティの `renderer#isSupportedShaderProgram()` が偽を返した場合、
                * `renderer#setShaderProgram()` は呼ばれないことに注意。
                *
                * また `g.FilledRect` やその親エンティティに本値を指定した場合、対象の `g.FilledRect` の描画結果は不定である。
                * これは実装上の制限に基づく現バージョンの仕様である。
                *
                * この値に `undefined` を指定した場合、親のシェーダプログラムを利用する。
                * この値に `null` を指定した場合、明示的にデフォルトのシェーダプログラムを利用する。
                *
                * @default undefined
                */
            shaderProgram?: ShaderProgram;
    }
    /**
        * akashic-engineに描画される全てのエンティティを表す基底クラス。
        * 本クラス単体に描画処理にはなく、直接利用する場合はchildrenを利用したコンテナとして程度で利用される。
        */
    export class E extends Object2D implements CommonArea {
            /**
                * このエンティティに割り振られる `Game` 単位で一意のID。(ただし `local` が真である場合を除く)
                */
            id: number;
            /**
                * このエンティティがローカルであるか否か。
                * コンストラクタで真が指定された時、または属するシーンがローカルシーンまたはローカルティック補間シーンである時、この値は真である。
                *
                * この値が真である場合、このエンティティに対する point イベントはこのゲームインスタンスにのみ通知され、
                * 他の参加者・視聴者には通知されない。また真である場合、 `id` の値の一意性は保証されない。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を直接変更してはならない。
                */
            local: boolean;
            /**
                * このエンティティの全子エンティティ。
                * 子エンティティが存在しない場合、本フィールドの値は `undefined` または空配列である。
                */
            children: E[] | undefined;
            /**
                * 親。
                */
            parent: E | Scene | undefined;
            /**
                * このエンティティが属するシーン。
                */
            scene: Scene;
            /**
                * 様々な状態を表すビットフラグ。
                */
            state: EntityStateFlags;
            /**
                * ゲーム開発者向けのタグ情報管理コンテナ。
                * この値はゲームエンジンのロジックからは使用されず、ゲーム開発者は任意の目的に使用してよい。
                */
            tag: any;
            /**
                * このエンティティの描画時に利用されるシェーダプログラム。
                * `isSupportedShaderProgram()` が偽を返す `g.Rendere` で描画される時、 `g.Renderer#setShaderProgram()` は呼ばれないことに注意。
                *
                * また `g.FilledRect` やその親エンティティに本値を指定した場合、対象の `g.FilledRect` の描画結果は不定である。
                * これは実装上の制限に基づく現バージョンの仕様である。
                *
                * この値が `undefined` である場合、親のシェーダプログラムが利用される。
                * この値が `null` である場合、明示的にデフォルトのシェーダプログラムが利用される。
                *
                * この値を変更した場合、 `this.modified()` を呼び出す必要がある。
                */
            shaderProgram: ShaderProgram | null | undefined;
            /**
                * 子にtouchableなものが含まれているかどうかを表す。
                * @private
                */
            _hasTouchableChildren: boolean;
            /**
                * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
                */
            get onUpdate(): Trigger<void>;
            /**
                * このエンティティのmessageイベント。
                */
            get onMessage(): Trigger<MessageEvent>;
            /**
                * このエンティティのpoint downイベント。
                */
            get onPointDown(): Trigger<PointDownEvent>;
            /**
                * このエンティティのpoint upイベント。
                */
            get onPointUp(): Trigger<PointUpEvent>;
            /**
                * このエンティティのpoint moveイベント。
                */
            get onPointMove(): Trigger<PointMoveEvent>;
            /**
                * プレイヤーにとって触れられるオブジェクトであるかを表す。
                *
                * この値が偽である場合、ポインティングイベントの対象にならない。
                * 初期値は `false` である。
                *
                * `E` の他のプロパティと異なり、この値の変更後に `this.modified()` を呼び出す必要はない。
                */
            get touchable(): boolean;
            set touchable(v: boolean);
            /**
                * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onUpdate` を利用すること。
                */
            get update(): Trigger<void>;
            /**
                * このエンティティのmessageイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onMessage` を利用すること。
                */
            get message(): Trigger<MessageEvent>;
            /**
                * このエンティティのpoint downイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointDown` を利用すること。
                */
            get pointDown(): Trigger<PointDownEvent>;
            /**
                * このエンティティのpoint upイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointUp` を利用すること。
                */
            get pointUp(): Trigger<PointUpEvent>;
            /**
                * このエンティティのpoint moveイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointMove` を利用すること。
                */
            get pointMove(): Trigger<PointMoveEvent>;
            /**
                * 各種パラメータを指定して `E` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: EParameterObject);
            /**
                * 自分自身と子孫の内容を描画する。
                *
                * このメソッドは、 `Renderer#draw()` からエンティティのツリー構造をトラバースする過程で暗黙に呼び出される。
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * @param renderer 描画先に対するRenderer
                * @param camera 対象のカメラ。省略された場合、undefined
                */
            render(renderer: Renderer, camera?: Camera): void;
            /**
                * 自分自身の内容を描画する。
                *
                * このメソッドは、 `Renderer#draw()` からエンティティのツリー構造をトラバースする過程で暗黙に呼び出される。
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                *
                * 戻り値は、このエンティティの子孫の描画をスキップすべきであれば偽、でなければ真である。
                * (この値は、子孫の描画方法をカスタマイズする一部のサブクラスにおいて、通常の描画パスをスキップするために用いられる)
                *
                * @param _renderer 描画先に対するRenderer
                * @param _camera 対象のカメラ
                */
            renderSelf(_renderer: Renderer, _camera?: Camera): boolean;
            /**
                * このエンティティが属する `Game` を返す。
                */
            game(): Game;
            /**
                * 子を追加する。
                *
                * @param e 子エンティティとして追加するエンティティ
                */
            append(e: E): void;
            /**
                * 子を挿入する。
                *
                * `target` が`this` の子でない場合、`append(e)` と同じ動作となる。
                *
                * @param e 子エンティティとして追加するエンティティ
                * @param target 挿入位置にある子エンティティ
                */
            insertBefore(e: E, target: E | undefined): void;
            /**
                * 子を削除する。
                *
                * `e` が `this` の子でない場合、 `AssertionError` がthrowされる。
                * `e === undefined` であり親がない場合、 `AssertionError` がthrowされる。
                *
                * @param e 削除する子エンティティ。省略された場合、自身を親から削除する
                */
            remove(e?: E): void;
            /**
                * このエンティティを破棄する。
                *
                * 親がある場合、親からは `remove()` される。
                * 子孫を持っている場合、子孫も破棄される。
                */
            destroy(): void;
            /**
                * このエンティティが破棄済みであるかを返す。
                */
            destroyed(): boolean;
            /**
                * このエンティティに対する変更をエンジンに通知する。
                *
                * このメソッドの呼び出し後、 `this` に対する変更が各 `Renderer` の描画に反映される。
                * ただし逆は真ではない。すなわち、再描画は他の要因によって行われることもある。
                * ゲーム開発者は、このメソッドを呼び出していないことをもって再描画が行われていないことを仮定してはならない。
                *
                * 本メソッドは、このオブジェクトの `Object2D` 由来のプロパティ (`x`, `y`, `angle` など) を変更した場合にも呼びだす必要がある。
                * 本メソッドは、描画キャッシュの無効化処理を含まない。描画キャッシュを持つエンティティは、このメソッドとは別に `invalidate()` を提供している。
                * 描画キャッシュの無効化も必要な場合は、このメソッドではなくそちらを呼び出す必要がある。
                * @param _isBubbling 通常ゲーム開発者が指定する必要はない。この変更通知が、(このエンティティ自身のみならず)子孫の変更の通知を含む場合、真を渡さなければならない。省略された場合、偽。
                */
            modified(_isBubbling?: boolean): void;
            /**
                * このメソッドは、 `E#findPointSourceByPoint()` 内で子孫の探索をスキップすべきか判断するために呼ばれる。
                * 通常、子孫の描画方法をカスタマイズする一部のサブクラスにおいて、与えられた座標に対する子孫の探索を制御する場合に利用する。
                * ゲーム開発者がこのメソッドを呼び出す必要はない。
                *
                * 戻り値は、子孫の探索をスキップすべきであれば偽、でなければ真である。
                *
                * @param _point このエンティティ（`this`）の位置を基準とした相対座標
                */
            shouldFindChildrenByPoint(_point: CommonOffset): boolean;
            /**
                * 自身と自身の子孫の中で、その座標に反応する `PointSource` を返す。
                *
                * 戻り値は、対象が見つかった場合、 `target` に見つかったエンティティを持つ `PointSource` である。
                * 対象が見つからなかった場合、 `undefined` である。戻り値が `undefined` でない場合、その `target` プロパティは次を満たす:
                * - このエンティティ(`this`) またはその子孫である
                * - `E#touchable` が真である
                *
                * @param point 対象の座標
                * @param m `this` に適用する変換行列。省略された場合、単位行列
                * @param force touchable指定を無視する場合真を指定する。省略された場合、偽
                */
            findPointSourceByPoint(point: CommonOffset, m?: Matrix, force?: boolean): PointSource | undefined;
            /**
                * このEが表示状態であるかどうかを返す。
                */
            visible(): boolean;
            /**
                * このEを表示状態にする。
                *
                * `this.hide()` によって非表示状態にされたエンティティを表示状態に戻す。
                * 生成直後のエンティティは表示状態であり、 `hide()` を呼び出さない限りこのメソッドを呼び出す必要はない。
                */
            show(): void;
            /**
                * このEを非表示状態にする。
                *
                * `this.show()` が呼ばれるまでの間、このエンティティは各 `Renderer` によって描画されない。
                * また `Game#findPointSource()` で返されることもなくなる。
                * `this#pointDown`, `pointMove`, `pointUp` なども通常の方法ではfireされなくなる。
                */
            hide(): void;
            /**
                * このEの包含矩形を計算する。
                */
            calculateBoundingRect(): CommonRect | undefined;
            /**
                * このEの位置を基準とした相対座標をゲームの左上端を基準とした座標に変換する。
                * @param offset Eの位置を基準とした相対座標
                */
            localToGlobal(offset: CommonOffset): CommonOffset;
            /**
                * ゲームの左上端を基準とした座標をこのEの位置を基準とした相対座標に変換する。
                * @param offset ゲームの左上端を基準とした座標
                */
            globalToLocal(offset: CommonOffset): CommonOffset;
            /**
                * このエンティティの座標系を、指定された祖先エンティティ (またはシーン) の座標系に変換する行列を求める。
                *
                * 指定されたエンティティが、このエンティティの祖先でない時、その値は無視される。
                * 指定されたシーンが、このエンティティの属するシーン出ない時、その値は無視される。
                *
                * @param target 座標系の変換先エンティティまたはシーン。省略した場合、このエンティティの属するシーン(グローバル座標系への変換行列になる)
                * @private
                */
            _calculateMatrixTo(target?: E | Scene): Matrix;
            /**
                * このエンティティと与えられたエンティティの共通祖先のうち、もっとも子孫側にあるものを探す。
                * 共通祖先がない場合、 `undefined` を返す。
                *
                * @param target このエンティティとの共通祖先を探すエンティティ
                * @private
                */
            _findLowestCommonAncestorWith(target: E): E | Scene | undefined;
            /**
                * @private
                */
            _calculateBoundingRect(m?: Matrix): CommonRect | undefined;
            /**
                * @private
                */
            _enableTouchPropagation(): void;
            /**
                * @private
                */
            _disableTouchPropagation(): void;
            /**
                * @private
                */
            _isTargetOperation(e: PointEvent): boolean;
    }
}

declare module 'g/lib/Event' {
    import type { CommonOffset } from "@akashic/pdi-types";
    import type { Player } from "g/lib/Player";
    import type { RandomGenerator } from "g/lib/RandomGenerator";
    /**
        * イベントの種別。
        *
        * - `"unknown"`: 不明なイベント。ゲーム開発者はこの値を利用してはならない。
        * - `"join"`: プレイヤーの参加を表すイベント。
        * - `"leave"`: プレイヤーの離脱を表すイベント。
        * - `"timestamp"`: タイムスタンプを表すイベント。
        * - `"player-info"`: プレイヤー情報を表すイベント。
        * - `"seed"`: 乱数生成器の生成を表すイベント。この値は現在利用されていない。
        * - `"point-down"`: ポイントダウンイベント。
        * - `"point-move"`: ポイントムーブイベント。
        * - `"point-up"`: ポイントアップイベント。
        * - `"message"`: 汎用的なメッセージを表すイベント。
        * - `"operation"`: 操作プラグインが通知する操作を表すイベント。
        */
    export type EventTypeString = "unknown" | "join" | "leave" | "timestamp" | "player-info" | "seed" | "point-down" | "point-move" | "point-up" | "message" | "operation";
    /**
        * イベントを表すインターフェース。
        */
    export interface Event {
            /**
                * イベントの種別。
                */
            type: EventTypeString;
            /**
                * イベントフラグ値。
                * 詳細な仕様は @akashic/playlog を参照のこと。
                */
            eventFlags: number;
            /**
                * このイベントがローカルであるか否か。
                */
            local?: boolean;
    }
    /**
        * ポインティングソースによる対象を表すインターフェース。
        * 対象とその対象から見た相対座標によって構成される。
        */
    export interface PointSourceBase<T extends PointTarget> {
            target: T | undefined;
            point: CommonOffset | undefined;
            local?: boolean;
    }
    /**
        * ポインティングの対象を表すインターフェース。
        */
    export interface PointTarget extends CommonOffset {
            id: number;
    }
    /**
        * ポインティング操作を表すイベントの基底クラス。
        * PointEvent#targetでそのポインティング操作の対象が、
        * PointEvent#pointでその対象からの相対座標が取得できる。
        *
        * 本イベントはマルチタッチに対応しており、PointEvent#pointerIdを参照することで識別することが出来る。
        *
        * abstract
        */
    export class PointEventBase<T extends PointTarget> implements Event {
            /**
                * 本クラスはどのtypeにも属さない。
                */
            type: "point-down" | "point-move" | "point-up";
            eventFlags: number;
            local: boolean;
            player: Player | undefined;
            pointerId: number;
            point: CommonOffset;
            target: T | undefined;
            button: number;
            constructor(pointerId: number, target: T | undefined, point: CommonOffset, player?: Player, local?: boolean, eventFlags?: number, button?: number);
    }
    /**
        * ポインティング操作の開始を表すイベントの基底クラス。
        */
    export class PointDownEventBase<T extends PointTarget> extends PointEventBase<T> {
            type: "point-down";
    }
    /**
        * ポインティング操作の終了を表すイベントの基底クラス。
        * PointDownEvent後にのみ発生する。
        *
        * PointUpEvent#startDeltaによってPointDownEvent時からの移動量が、
        * PointUpEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
        * PointUpEvent#pointにはPointDownEvent#pointと同じ値が格納される。
        */
    export class PointUpEventBase<T extends PointTarget> extends PointEventBase<T> {
            type: "point-up";
            startDelta: CommonOffset;
            prevDelta: CommonOffset;
            constructor(pointerId: number, target: T | undefined, point: CommonOffset, prevDelta: CommonOffset, startDelta: CommonOffset, player?: Player, local?: boolean, eventFlags?: number, button?: number);
    }
    /**
        * ポインティング操作の移動を表すイベント。
        * PointDownEvent後にのみ発生するため、MouseMove相当のものが本イベントとして発生することはない。
        *
        * PointMoveEvent#startDeltaによってPointDownEvent時からの移動量が、
        * PointMoveEvent#prevDeltaによって直近のPointMoveEventからの移動量が取得出来る。
        * PointMoveEvent#pointにはPointMoveEvent#pointと同じ値が格納される。
        *
        * 本イベントは、プレイヤーがポインティングデバイスを移動していなくても、
        * カメラの移動等視覚的にポイントが変化している場合にも発生する。
        */
    export class PointMoveEventBase<T extends PointTarget> extends PointEventBase<T> {
            type: "point-move";
            startDelta: CommonOffset;
            prevDelta: CommonOffset;
            constructor(pointerId: number, target: T | undefined, point: CommonOffset, prevDelta: CommonOffset, startDelta: CommonOffset, player?: Player, local?: boolean, eventFlags?: number, button?: number);
    }
    /**
        * 汎用的なメッセージを表すイベント。
        * MessageEvent#dataによってメッセージ内容を取得出来る。
        */
    export class MessageEvent implements Event {
            type: "message";
            eventFlags: number;
            local: boolean;
            player: Player | undefined;
            data: any;
            constructor(data: any, player?: Player, local?: boolean, eventFlags?: number);
    }
    /**
        * 操作プラグインが通知する操作を表すイベント。
        * プラグインを識別する `OperationEvent#code` と、プラグインごとの内容 `OperationEvent#data` を持つ。
        */
    export class OperationEvent implements Event {
            type: "operation";
            eventFlags: number;
            local: boolean;
            player: Player | undefined;
            code: number;
            data: any;
            constructor(code: number, data: any, player?: Player, local?: boolean, eventFlags?: number);
    }
    /**
        * プレイヤーの参加を表すイベント。
        * JoinEvent#playerによって、参加したプレイヤーを取得出来る。
        */
    export class JoinEvent implements Event {
            type: "join";
            eventFlags: number;
            player: Player;
            storageValues: unknown;
            constructor(player: Player, eventFlags?: number);
    }
    /**
        * プレイヤーの離脱を表すイベント。
        * LeaveEvent#playerによって、離脱したプレイヤーを取得出来る。
        */
    export class LeaveEvent implements Event {
            type: "leave";
            eventFlags: number;
            player: Player;
            constructor(player: Player, eventFlags?: number);
    }
    /**
        * タイムスタンプを表すイベント。
        */
    export class TimestampEvent implements Event {
            type: "timestamp";
            eventFlags: number;
            player: Player;
            timestamp: number;
            constructor(timestamp: number, player: Player, eventFlags?: number);
    }
    /**
        * プレイヤー情報を表すイベント。
        * PointInfoEvent#player.nameによってプレイヤー名を、PlayerInfoEvent#player.userDataによって送信者依存の追加データを取得できる。
        */
    export class PlayerInfoEvent implements Event {
            type: "player-info";
            eventFlags: number;
            player: Player;
            constructor(player: Player, eventFlags?: number);
    }
    /**
        * 新しい乱数の発生を表すイベント。
        * SeedEvent#generatorによって、本イベントで発生したRandomGeneratorを取得出来る。
        */
    export class SeedEvent implements Event {
            type: "seed";
            eventFlags: number;
            generator: RandomGenerator;
            constructor(generator: RandomGenerator, eventFlags?: number);
    }
}

declare module 'g/lib/EventConverter' {
    import * as pl from "@akashic/playlog";
    import type { E } from "g/lib/entities/E";
    import type { Event } from "g/lib/Event";
    import type { InternalOperationPluginOperation } from "g/lib/OperationPluginOperation";
    import type { Player } from "g/lib/Player";
    import type { WeakRefKVS } from "g/lib/WeakRefKVS";
    export interface EventConverterParameterObjectGameLike {
            db: WeakRefKVS<E>;
            _localDb: WeakRefKVS<E>;
            _decodeOperationPluginOperation: (code: number, op: (number | string)[]) => any;
    }
    export interface EventConverterParameterObject {
            game: EventConverterParameterObjectGameLike;
            playerId?: string;
    }
    /**
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        * @ignore
        */
    export class EventConverter {
            _game: EventConverterParameterObjectGameLike;
            _playerId: string | null;
            _playerTable: {
                    [key: string]: Player;
            };
            constructor(param: EventConverterParameterObject);
            /**
                * playlog.Eventからg.Eventへ変換する。
                */
            toGameEvent(pev: pl.Event): Event;
            /**
                * g.Eventからplaylog.Eventに変換する。
                */
            toPlaylogEvent(e: Event, preservePlayer?: boolean): pl.Event;
            makePlaylogOperationEvent(op: InternalOperationPluginOperation): pl.Event;
    }
}

declare module 'g/lib/EventFilter' {
    import type { Event } from "@akashic/playlog";
    import type { EventFilterController } from "g/lib/EventFilterController";
    /**
      * イベントフィルタ。
      *
      * 詳細は `Game#addEventFilter()` のドキュメントを参照。
      */
    export type EventFilter = (events: Event[], controller: EventFilterController) => Event[];
}

declare module 'g/lib/GameHandlerSet' {
    import type * as pl from "@akashic/playlog";
    import type { EventFilter } from "g/lib/EventFilter";
    import type { LocalTickModeString } from "g/lib/LocalTickModeString";
    import type { TickGenerationModeString } from "g/lib/TickGenerationModeString";
    export interface SceneMode {
            local: LocalTickModeString;
            tickGenerationMode: TickGenerationModeString;
    }
    /**
        * エンジンから呼び出される実装依存処理
        */
    export interface GameHandlerSet {
            /**
                * ティックを発生させる。
                * @param events そのティックで追加で発生させるイベント
                */
            raiseTick(events?: pl.Event[]): void;
            /**
                * イベントを発生させる。
                *
                * @param event 発生させるイベント
                */
            raiseEvent(event: pl.Event): void;
            /**
                * イベントフィルタを追加する。
                *
                * @param func イベントフィルタ
                * @param handleEmpty イベントが存在しない場合でも定期的にフィルタを呼び出すか否か。省略された場合、偽。
                */
            addEventFilter(func: EventFilter, handleEmpty?: boolean): void;
            /**
                * イベントフィルタを削除する
                * @param func イベントフィルタ
                */
            removeEventFilter(func: EventFilter): void;
            /**
                * 全てのイベントフィルタを削除する
                */
            removeAllEventFilters(): void;
            /**
                * g.Scene のモード変更を通知する
                * @param mode
                */
            changeSceneMode(mode: SceneMode): void;
            /**
                * このインスタンスにおいてスナップショットの保存を行うべきかを返す。
                */
            shouldSaveSnapshot(): boolean;
            /**
                * スナップショットを保存する。
                *
                * @param frame スナップショットのフレーム。
                * @param snapshot 保存するスナップショット。JSONとして妥当な値でなければならない。
                * @param randGenSer 乱数生成器のシリアリゼーション。
                * @param nextEntityId 次のエンティティID
                * @param timestamp 保存時の時刻。 `g.TimestampEvent` を利用するゲームの場合、それらと同じ基準の時間情報を与えなければならない。
                */
            saveSnapshot(frame: number, snapshot: any, randGenSer: any, nextEntityId: number, timestamp?: number): void;
            /**
                * このインスタンスの種別を取得する
                */
            getInstanceType(): "active" | "passive";
            /**
                * 現在時刻を取得する。
                *
                * 値は1970-01-01T00:00:00Zからのミリ秒での経過時刻である。
                * `Date.now()` と異なり、この値は消化されたティックの数から算出される擬似的な時刻である。
                */
            getCurrentTime(): number;
    }
}

declare module 'g/lib/GameMainParameterObject' {
    /**
        * ゲームのエントリポイントに渡される引数。
        */
    export interface GameMainParameterObject {
            /**
                * スナップショット。
                *
                * 以前にこのゲームが `Game#reqestSaveSnapshot()` で保存を要求したスナップショットのいずれかが渡される。
                * 指定された場合、ゲーム開発者はスナップショット生成時のゲームの実行状態を再現せねばならない。
                * 指定されなかった場合は、新規にゲーム実行を開始せねばならない。
                * `requestSaveSnapshot()` を利用しないゲームにおいては、常に指定されない。
                */
            snapshot?: any;
            /**
                * 起動引数。
                */
            args?: any;
            /**
                * グローバル起動引数。
                * `snapshot` が指定される場合は常に指定されない。
                * この値は現在使用されていない。
                */
            globalArgs?: any;
    }
}

declare module 'g/lib/InitialScene' {
    import { Trigger } from "@akashic/trigger";
    import type { SceneParameterObject } from "g/lib/Scene";
    import { Scene } from "g/lib/Scene";
    /**
        * グローバルアセットを読み込むための初期シーン。
        */
    export class InitialScene extends Scene {
            /**
                * ゲームの実行に必要なグローバルアセットがすべて読み込まれた際に発火される Trigger。
                * `gameConfiguration` に `assetBundle` が指定されている場合は、そのアセットもすべて読み込み完了後に発火される。
                * 一方、`this.onLoad` は `gameConfiguration` の `assetBundle` 指定を無視して発火する点に注意が必要。
                */
            onAllAssetsLoad: Trigger<void>;
            constructor(param: SceneParameterObject);
            destroy(): void;
            _handleLoad(): void;
            _handleRequestAssets(): void;
    }
}

declare module 'g/lib/LoadingScene' {
    import type { Asset } from "@akashic/pdi-types";
    import { Trigger } from "@akashic/trigger";
    import type { SceneParameterObject } from "g/lib/Scene";
    import { Scene } from "g/lib/Scene";
    export interface LoadingSceneParameterObject extends SceneParameterObject {
            /**
                * 読み込み完了時に暗黙に呼び出される `LoadingScene#end()` を抑止するか否か。
                *
                * この値を真にする場合、ゲーム開発者はローディングシーンを終了するために明示的に `end()` を呼び出す必要がある。
                * `end()` の呼び出しは `targetReady` のfire後でなければならない点に注意すること。
                *
                * @default false
                */
            explicitEnd?: boolean;
    }
    /**
        * Assetの読み込み中に表示されるシーン。
        *
        * 本シーンは通常のシーンと異なり、ゲーム内時間(`Game#age`)と独立に実行される。
        * アセットやストレージデータを読み込んでいる間、ゲーム内時間が進んでいない状態でも、
        * `LoadingScene` は画面に変化を与えることができる(`update` がfireされる)。
        *
        * ゲーム開発者は、ローディング中の演出を実装した独自の `LoadingScene` を
        * `Game#loadingScene` に代入することでエンジンに利用させることができる。
        *
        * ゲーム内時間と独立に処理される `LoadingScene` での処理には再現性がない(他プレイヤーと状態が共有されない)。
        * そのため `Game` に対して副作用のある操作を行ってはならない点に注意すること。
        */
    export class LoadingScene extends Scene {
            /**
                * ローディングシーンの読み込み待ち対象シーンが切り替わった場合にfireされるTrigger。
                * ゲーム開発者は、このTriggerにaddしてローディングシーンの内容を初期化することができる。
                */
            onTargetReset: Trigger<Scene>;
            /**
                * ローディングシーンの読み込みが完了した時にfireされるTrigger。
                * `explicitEnd` に真を渡して生成した場合、ローディングシーンを終了するには
                * このTriggerのfire後に明示的に `end()` を呼び出す必要がある。
                */
            onTargetReady: Trigger<Scene>;
            /**
                * ローディングシーンの読み込み待ち対象シーンがアセットを読み込む度にfireされるTrigger。
                */
            onTargetAssetLoad: Trigger<Asset>;
            /**
                * ローディングシーンの読み込み待ち対象シーンが切り替わった場合にfireされるTrigger。
                * ゲーム開発者は、このTriggerにaddしてローディングシーンの内容を初期化することができる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onTargetReset` を利用すること。
                */
            targetReset: Trigger<Scene>;
            /**
                * ローディングシーンの読み込みが完了した時にfireされるTrigger。
                * `explicitEnd` に真を渡して生成した場合、ローディングシーンを終了するには
                * このTriggerのfire後に明示的に `end()` を呼び出す必要がある。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onTargetReady` を利用すること。
                */
            targetReady: Trigger<Scene>;
            /**
                * ローディングシーンの読み込み待ち対象シーンがアセットを読み込む度にfireされるTrigger。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onTargetAssetLoad` を利用すること。
                */
            targetAssetLoaded: Trigger<Asset>;
            /**
                * @private
                */
            _explicitEnd: boolean;
            /**
                * @private
                */
            _targetScene: Scene;
            /**
                * `LoadingScene` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: LoadingSceneParameterObject);
            destroy(): void;
            /**
                * アセットロード待ち対象シーンを変更する。
                *
                * このメソッドは、新たにシーンのロード待ちが必要になった場合にエンジンによって呼び出される。
                * (派生クラスはこの処理をオーバーライドしてもよいが、その場合その中で
                * このメソッド自身 (`g.LoadingScene.prototype.reset`) を呼び出す (`call()` する) 必要がある。)
                *
                * @param targetScene アセットロード待ちが必要なシーン
                */
            reset(targetScene: Scene): void;
            /**
                * アセットロード待ち対象シーンの残りのロード待ちアセット数を取得する。
                */
            getTargetWaitingAssetsCount(): number;
            /**
                * ローディングシーンを終了する。
                *
                * `Scene#end()` と異なり、このメソッドの呼び出しはこのシーンを破棄しない。(ローディングシーンは再利用される。)
                * このメソッドが呼び出される時、 `targetReady` がfireされた後でなければならない。
                */
            end(): void;
            /**
                * @private
                */
            _clearTargetScene(): void;
            /**
                * @private
                */
            _doReset(): void;
            /**
                * @private
                */
            _handleAssetLoad(asset: Asset): void;
            /**
                * @private
                */
            _handleReady(scene: Scene): void;
    }
}

declare module 'g/lib/LocalTickModeString' {
    /**
      * シーンがローカルティックを受け取る方法。
      *
      * - `"non-local"`: ローカルティックを受け取らない。通常の (非ローカルの) シーン。
      * - `"full-local"`: ローカルティックのみを受け取る。ローカルシーン。
      * - `"interpolate-local"` 消化すべき非ローカルティックがない間、ローカルティックを受け取る。ローカルティック補間シーン。
      */
    export type LocalTickModeString = "non-local" | "full-local" | "interpolate-local";
}

declare module 'g/lib/ModuleManager' {
    import type { Asset, ScriptAssetRuntimeValueBase } from "@akashic/pdi-types";
    import type { AssetManager, OneOfAsset } from "g/lib/AssetManager";
    import { Module } from "g/lib/Module";
    import type { RequireCacheable } from "g/lib/RequireCacheable";
    /**
        * `Module` を管理するクラス。
        * このクラスのインスタンスは `Game` に一つ存在し、スクリプトアセットの require() の解決に利用される。
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        */
    export class ModuleManager {
            /**
                * アセットの管理者。
                * @private
                */
            _assetManager: AssetManager;
            /**
                * ScriptAssetの実行結果キャッシュ。
                * g.require経由の場合ここに格納される。
                * @private
                */
            _scriptCaches: {
                    [key: string]: RequireCacheable;
            };
            /**
                * @private
                */
            _runtimeValueBase: ScriptAssetRuntimeValueBase;
            constructor(runtimeBase: ScriptAssetRuntimeValueBase, assetManager: AssetManager);
            /**
                * エンジン内部で利用する _require() を wrap した関数
                *
                * 引数の仕様については `_require()` の仕様を参照のこと。
                * _require() の戻り値で __esModule が真の場合に戻り値の .default を返す。
                * 現状 Akashic Engine では ESM を扱えていない。そのため、対象の __esModule を参照し .default を返すことで、
                * TypeScript/Babel 向けの簡易対応とし exports.default を扱えるようにしている。
                * 通常、ゲーム開発者がこのメソッドを利用する必要はない。
                *
                * @ignore
                */
            _internalRequire(path: string, currentModule?: Module): any;
            /**
                * node.js の require() ライクな読み込み処理を行い、その結果を返す。
                *
                * node.jsのrequireに限りなく近いモデルでrequireする。
                * ただしアセットIDで該当すればそちらを優先する。また node.js のコアモジュールには対応していない。
                * 通常、ゲーム開発者が利用するのは `Module#require()` であり、このメソッドはその内部実装を提供する。
                *
                * @ignore
                * @param path requireのパス。相対パスと、Asset識別名を利用することが出来る。
                *              なお、./xxx.json のようにjsonを指定する場合、そのAssetはTextAssetである必要がある。
                *              その他の形式である場合、そのAssetはScriptAssetである必要がある。
                * @param currentModule このrequireを実行した Module
                * @returns {any} スクリプト実行結果。通常はScriptAsset#executeの結果。
                *                 例外的に、jsonであればTextAsset#dataをJSON.parseした結果が返る
                */
            _require(path: string, currentModule?: Module): any;
            /**
                * 対象のモジュールからの相対パスを、 game.json のディレクトリをルート (`/`) とする `/` 区切りの絶対パス形式として解決する。
                * `this._require()` と違い `path` にアセットIDが指定されても解決しない点に注意。
                * 通常、ゲーム開発者が利用するのは `require.resolve()` であり、このメソッドはその内部実装を提供する。
                *
                * @ignore
                * @param path resolve する対象のパス。相対パスを利用することができる。
                * @param currentModule この require を実行した Module 。
                * @returns {string} 絶対パス
                */
            _resolvePath(path: string, currentModule?: Module): string;
            /**
                * 与えられたパス文字列がファイルパスであると仮定して、対応するアセットを探す。
                * 見つかった場合そのアセットを、そうでない場合 `undefined` を返す。
                * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
                *
                * @ignore
                * @param resolvedPath パス文字列
                * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
                */
            _findAssetByPathAsFile(resolvedPath: string, liveAssetPathTable: {
                    [key: string]: OneOfAsset;
            }): OneOfAsset | undefined;
            /**
                * 与えられたパス文字列がファイルパスであると仮定して、対応するアセットの絶対パスを解決する。
                * アセットが存在した場合はそのパスを、そうでない場合 `null` を返す。
                * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
                *
                * @ignore
                * @param resolvedPath パス文字列
                * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
                */
            _resolveAbsolutePathAsFile(resolvedPath: string, liveAssetPathTable: {
                    [key: string]: Asset;
            }): string | null;
            /**
                * 与えられたパス文字列がディレクトリパスであると仮定して、対応するアセットの絶対パスを解決する。
                * アセットが存在した場合はそのパスを、そうでない場合 `null` を返す。
                * 通常、ゲーム開発者がファイルパスを扱うことはなく、このメソッドを呼び出す必要はない。
                * ディレクトリ内に package.json が存在する場合、package.json 自体もアセットとして
                * `liveAssetPathTable` から参照可能でなければならないことに注意。
                *
                * @ignore
                * @param resolvedPath パス文字列
                * @param liveAssetPathTable パス文字列のプロパティに対応するアセットを格納したオブジェクト
                */
            _resolveAbsolutePathAsDirectory(resolvedPath: string, liveAssetPathTable: {
                    [key: string]: OneOfAsset;
            }): string | null;
    }
}

declare module 'g/lib/OperationPlugin' {
    import type { Trigger } from "@akashic/trigger";
    import type { OperationPluginOperation } from "g/lib/OperationPluginOperation";
    /**
        * 操作プラグインの実装すべきインターフェース。
        * Static methodについては `OperationPluginStatic` を参照。
        */
    export interface OperationPlugin {
            /**
                * このプラグインが生成した操作を通知する `Trigger` 。
                */
            operationTrigger: Trigger<OperationPluginOperation | (number | string)[]>;
            /**
                * このプラグインを開始する。
                * このメソッドの呼び出し以降、 `this.operationTrigger` がfireされる可能性がある。
                */
            start(): void;
            /**
                * このプラグインを停止する。
                * このメソッドの呼び出し以降、 `this.operationTrigger` がfireされることはない。
                */
            stop(): void;
            /**
                * `operationTrigger` で通知した操作のデコードを行う。
                *
                * 通常、`operationTrigger` で通知した操作の情報は、 `g.OperationEvent#data` に保持されてゲームスクリプトに渡される。
                * このメソッドが存在する場合、 通知した操作をこのメソッドに渡して呼び出したその戻り値が `g.OperationEvent#data` に与えられるようになる。
                */
            decode?(op: (number | string)[]): any;
    }
}

declare module 'g/lib/OperationPluginManager' {
    import type { OperationPluginViewInfo } from "@akashic/pdi-types";
    import { Trigger } from "@akashic/trigger";
    import type { Game } from "g/lib/Game";
    import type { OperationPlugin } from "g/lib/OperationPlugin";
    import type { InternalOperationPluginOperation } from "g/lib/OperationPluginOperation";
    import type { OperationPluginStatic } from "g/lib/OperationPluginStatic";
    /**
        * 操作プラグインを管理するクラス。
        * 通常は game.json の `operationPlugins` フィールドを基に自動的に初期化される他、
        * ゲーム開発者は本クラスを用いて直接操作プラグインを登録することもできる。
        * 詳細は `this.register()` のコメントを参照。
        *
        * 本クラスのインスタンスをゲーム開発者が直接生成することない。
        */
    export class OperationPluginManager {
            /**
                * 操作プラグインの操作を通知する `Trigger` 。
                */
            onOperate: Trigger<InternalOperationPluginOperation>;
            /**
                * 操作プラグインの操作を通知する `Trigger` 。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onOperate` を利用すること。
                */
            operated: Trigger<InternalOperationPluginOperation>;
            /**
                * ロードしている操作プラグインを保持するオブジェクト。
                */
            plugins: {
                    [key: number]: OperationPlugin;
            };
            constructor(game: Game, viewInfo: OperationPluginViewInfo | null);
            /**
                * 操作プラグインを手動で登録する。
                * このメソッドを利用する場合、game.json の `operationPlugins` フィールドから該当の定義を省略する必要がある。
                * 登録後、ゲーム開発者自身で `OperationPluginManager#start()` を呼び出さなければならない点に注意。
                * @param pluginClass new 可能な操作プラグインの実態
                * @param code 操作プラグインの識別コード
                * @param option 操作プラグインのコンストラクタに渡すパラメータ
                */
            register(pluginClass: OperationPluginStatic, code: number, option?: any): OperationPlugin | undefined;
            /**
                * 対象の操作プラグインを開始する。
                * @param code 操作プラグインの識別コード
                */
            start(code: number): void;
            /**
                * 対象の操作プラグインを終了する。
                * @param code 操作プラグインの識別コード
                */
            stop(code: number): void;
            destroy(): void;
            reset(): void;
            stopAll(): void;
    }
}

declare module 'g/lib/OperationPluginOperation' {
    /**
        * 操作プラグインが生成・通知する操作の情報。
        */
    export interface OperationPluginOperation {
            /**
                * この操作の内容。
                */
            data: (number | string)[];
            /**
                * この操作がローカルであるか否か。
                *
                * 真である場合、この操作によって生成される `OperationEvent` はローカルイベントになる (`local` に真が与えられる)。
                * 省略された場合、偽。
                */
            local?: boolean;
            /**
                * この操作に対する要求優先度。
                */
            priority?: number;
    }
    /**
        * エンジン内部で用いる、操作プラグインが生成・通知する操作の情報。
        * 本インターフェースをゲーム開発者が利用する必要はない。
        */
    export interface InternalOperationPluginOperation extends OperationPluginOperation {
            /**
                * @private
                */
            _code: number;
    }
}

declare module 'g/lib/PointEventResolver' {
    import type { CommonOffset, PlatformPointEvent } from "@akashic/pdi-types";
    import * as pl from "@akashic/playlog";
    import type { Camera } from "g/lib/Camera";
    import type { PointSource } from "g/lib/entities/E";
    export interface PointSourceResolver {
            findPointSource(point: CommonOffset, camera?: Camera): PointSource | undefined;
    }
    export interface PointEventResolverParameterObject {
            /**
                * この `PointEventResolver` がエンティティの解決などに用いる `PointSourceResolver` 。
                */
            sourceResolver: PointSourceResolver;
            /**
                * プレイヤーID
                */
            playerId: string;
            /**
                * 同時にポイント可能な上限
                */
            maxPoints?: number;
    }
    /**
        * PlatformPointEventからg.Eventへの変換機構。
        *
        * ほぼ座標しか持たないPlatformPointEventに対して、g.Point(Down|Move|Up)Eventはその座標にあるエンティティや、
        * (g.Point(Move|Up)Eventの場合)g.PointDownEventからの座標の差分を持っている。
        * それらの足りない情報を管理・追加して、PlatformPointEventをg.Eventに変換するクラス。
        * Platform実装はpointDown()なしでpointMove()を呼び出してくることも考えられるため、
        * Down -> Move -> Up の流れを保証する機能も持つ。
        *
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        * @ignore
        */
    export class PointEventResolver {
            _sourceResolver: PointSourceResolver;
            _playerId: string;
            _maxPoints: number | null;
            constructor(param: PointEventResolverParameterObject);
            pointDown(e: PlatformPointEvent): pl.PointDownEvent | null;
            pointMove(e: PlatformPointEvent): pl.PointMoveEvent | null;
            pointUp(e: PlatformPointEvent): pl.PointUpEvent | null;
    }
}

declare module 'g/lib/RandomGenerator' {
    /**
        * 乱数生成器。
        * `RandomGenerator#get()` によって、新しい乱数を生成することができる。
        */
    export abstract class RandomGenerator {
            /**
                * 本乱数生成器の種を表す。ゲーム開発者は本値を直接書き換えてはならない。
                */
            seed: number;
            constructor(seed: number);
            /**
                * 乱数を生成する。
                * `min` 以上 `max` 以下の数値を返す。
                *
                * @deprecated 非推奨である。将来的に削除される。代わりに `RandomGenerator#generate()` を利用すること。
                */
            abstract get(min: number, max: number): number;
            /**
                * 乱数を生成する。
                * 0 以上 1 未満の数値を返す。
                *
                * ローカルイベントの処理中を除き、原則 `Math.random()` ではなくこのメソッドを利用すること。
                */
            abstract generate(): number;
            abstract serialize(): any;
    }
}

declare module 'g/lib/Scene' {
    import type { Asset, CommonOffset } from "@akashic/pdi-types";
    import { Trigger } from "@akashic/trigger";
    import type { AssetAccessor } from "g/lib/AssetAccessor";
    import type { AssetGenerationConfiguration } from "g/lib/AssetGenerationConfiguration";
    import { AssetHolder } from "g/lib/AssetHolder";
    import type { AssetLoadFailureInfo } from "g/lib/AssetLoadFailureInfo";
    import type { Camera } from "g/lib/Camera";
    import type { DynamicAssetConfiguration } from "g/lib/DynamicAssetConfiguration";
    import type { E, PointDownEvent, PointMoveEvent, PointSource, PointUpEvent } from "g/lib/entities/E";
    import type { RequestAssetLoadError } from "g/lib/errors";
    import type { MessageEvent, OperationEvent } from "g/lib/Event";
    import type { Game } from "g/lib/Game";
    import type { LocalTickModeString } from "g/lib/LocalTickModeString";
    import type { TickGenerationModeString } from "g/lib/TickGenerationModeString";
    import type { Timer } from "g/lib/Timer";
    import type { TimerIdentifier } from "g/lib/TimerManager";
    import { TimerManager } from "g/lib/TimerManager";
    /**
        * `Scene#requestAssets()` 完了時の通知を受け取るハンドラ。
        *
        * @param error アセット読み込みエラー (発生した場合) 。エラーがない場合、 `undefined` 。
        */
    export type SceneRequestAssetHandler = (error?: RequestAssetLoadError) => void;
    /**
        * `Scene#requestAssets()` の引数に渡すことができるパラメータ。
        */
    export interface SceneRequestAssetsParameterObject {
            assetIds: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
            /**
                * アセットの読込みに失敗した際にコールバックを実行するかどうか。
                * @default false
                */
            notifyErrorOnCallback?: boolean;
    }
    /**
        * `Scene` のコンストラクタに渡すことができるパラメータ。
        * 説明のない各メンバの詳細は `Scene` の同名メンバの説明を参照すること。
        */
    export interface SceneParameterObject {
            /**
                * このシーンの属するゲーム。
                */
            game: Game;
            /**
                * このシーンで用いるアセットIDの配列。
                *
                * アセットIDとは、 game.jsonのassetsオブジェクトの各プロパティのキー文字列である。
                * アセットIDでなくパスで指定したい場合は `assetPaths` を利用できる。両方指定してもよい。
                *
                * @default undefined
                */
            assetIds?: (string | DynamicAssetConfiguration)[];
            /**
                * このシーンで用いるアセットのファイルパスの配列。
                *
                * 各要素は `/` から始まる絶対パスでなければならない。
                * ここでルートディレクトリ `/` はgame.json のあるディレクトリを指す。
                * ただしオーディオアセットに限り、拡張子を含まないパスであること。
                * (e.g. `/image/character01.png`, `/audio/bgm01`)
                *
                * パスでなくアセットIDで指定したい場合は `assetIds` を利用できる。両方指定してもよい。
                * game.jsonのassetsに定義がないアセット(ダイナミックアセット)は指定できない。
                *
                * @default undefined
                */
            assetPaths?: string[];
            /**
                * このシーンのローカルティック消化ポリシー。
                *
                * * `"full-local"` が与えられた場合、このシーンはローカルシーンと呼ばれる。
                *   ローカルシーンでは、他プレイヤーと独立な時間進行処理(ローカルティックの消化)が行われる。
                * * `"non-local"` が与えられた場合、このシーンは非ローカルシーンと呼ばれる。
                *   非ローカルシーンでは、他プレイヤーと共通の時間進行処理((非ローカル)ティックの消化)が行われる(onUpdateがfireされる)。
                *   ローカルティックを消化することはない。
                * * `"interpolate-local"` が与えられた場合、このシーンはローカルティック補間シーンと呼ばれる。
                *   ローカルティック補間シーンでは、非ローカルシーン同様にティックを消化するが、
                *   消化すべき非ローカルティックがない場合にローカルティックが補間され消化される。
                *
                * ローカルシーンに属するエンティティは、すべてローカルである(強制的にローカルエンティティとして生成される)。
                * ローカルシーンは特にアセットロード中のような、他プレイヤーと同期すべきでないシーンのために存在する機能である。
                *
                * `LocalTickModeString` の代わりに `boolean` を与えることもできる。
                * 偽は `"non-local"` 、 真は `"full-local"` と解釈される。
                * @default "non-local"
                */
            local?: boolean | LocalTickModeString;
            /**
                * このシーンの識別用の名前。
                * @default undefined
                */
            name?: string;
            /**
                * 時間経過の契機(ティック)をどのように生成するか。
                *
                * 省略された場合、 `"by-clock"` 。
                * `Manual` を指定した場合、 `Game#raiseTick()` を呼び出さない限りティックが生成されない(時間経過しない)。
                * ただしローカルティック(ローカルシーンの間などの「各プレイヤー間で独立な時間経過処理」)はこの値の影響を受けない。
                * またこのシーンへの遷移直後、一度だけこの値に関わらずティックが生成される。
                */
            tickGenerationMode?: TickGenerationModeString;
            /**
                * シーンスタック上のこのシーンが描画される時、それに先んじてこのシーンの直下のシーンを描画するかどうか。
                * このシーン自体は `seethrough` の値に関わらず常に描画されることに注意。
                * ただし `seethrough` が true の時でもこのシーン以外の onUpdate は実行されない。そのため下のシーンの描画内容も更新されない。この挙動は実験的なものであり、将来的に変更されうる。
                * @default false
                */
            seethrough?: boolean;
    }
    /**
        * そのSceneの状態を表す列挙子。
        *
        * - "destroyed": すでに破棄されているシーンで、再利用が不可能になっている状態を表す
        * - "standby": 初期化された状態のシーンで、シーンスタックへ追加されることを待っている状態を表す
        * - "active": シーンスタックの一番上にいるシーンで、ゲームのカレントシーンとして活性化されている状態を表す
        * - "deactive": シーンスタックにいるが一番上ではないシーンで、裏側で非活性状態になっていることを表す
        * - "before-destroyed": これから破棄されるシーンで、再利用が不可能になっている状態を表す
        */
    export type SceneStateString = "destroyed" | "standby" | "active" | "deactive" | "before-destroyed";
    export type SceneLoadStateString = "initial" | "ready" | "ready-fired" | "loaded-fired";
    /**
        * シーンを表すクラス。
        */
    export class Scene {
            /**
                * このシーンの子エンティティ。
                *
                * エンティティは `Scene#append()` によって追加され、 `Scene#remove()` によって削除される。
                */
            children: E[];
            /**
                * このシーンで利用できるアセット。
                *
                * アセットID をkeyに、対応するアセットのインスタンスを得ることができる。
                * keyはこのシーンの生成時、コンストラクタの第二引数 `assetIds` に渡された配列に含まれる文字列でなければならない。
                */
            assets: {
                    [key: string]: Asset;
            };
            /**
                * このシーンで利用できるアセットへのアクセッサ。
                *
                * 歴史的経緯による `assets` との違いに注意。
                * `assets` は「このシーンの生成時に読み込んだアセット」に「アセットIDをキーにして」アクセスするテーブルである。
                * 他方この `asset` は `getImageById()`, `getAllTexts()` などのメソッドを持つオブジェクトである。
                * アセットIDだけでなくパスでのアクセスや、複数アセットの一括取得ができる点で異なる。
                */
            asset: AssetAccessor;
            /**
                * このシーンの属するゲーム。
                */
            game: Game;
            /**
                * このシーンのローカルティック消化ポリシー。
                *
                * * `"non-local"` が与えられた場合、このシーンは非ローカルシーンと呼ばれる。
                *   非ローカルシーンでは、他プレイヤーと共通の時間進行処理((非ローカル)ティックの消化)が行われる(onUpdateがfireされる)。
                * * `"full-local"` が与えられた場合、このシーンはローカルシーンと呼ばれる。
                *   ローカルシーンでは、他プレイヤーと独立な時間進行処理(ローカルティックの消化)が行われる。
                * * `"interpolate-local"` が与えられた場合、このシーンはローカルティック補間シーンと呼ばれる。
                *   ローカルティック補間シーンは、非ローカルシーン同様にティックを消化するが、
                *   消化すべき非ローカルティックがない場合にローカルティックが補間され消化される。
                *
                * ローカルシーンとローカルティック補間シーンに属するエンティティは、
                * すべてローカルである(強制的にローカルエンティティとして生成される)。
                * ローカルシーンは特にアセットロード中のような、他プレイヤーと同期すべきでないシーンのために存在する機能である。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            local: LocalTickModeString;
            /**
                * 時間経過の契機(ティック)をどのように生成するか。
                * `"manual"` の場合、 `Game#raiseTick()` を呼び出さない限りティックが生成されない(時間経過しない)。
                * ただしローカルティック(ローカルシーンの間などの「各プレイヤー間で独立な時間経過処理」)はこの値の影響を受けない。
                * またこのシーンへの遷移直後、一度だけこの値に関わらずティックが生成される。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            tickGenerationMode: TickGenerationModeString;
            /**
                * シーンの識別用の名前。
                */
            name: string | undefined;
            /**
                * シーンスタック上のこのシーンが描画される時、それに先んじてこのシーンの直下のシーンを描画するかどうか。
                * このシーン自体は `seethrough` の値に関わらず常に描画されることに注意。
                * ただし `seethrough` が true の時でもこのシーン以外の onUpdate は実行されない。そのため下のシーンの描画内容も更新されない。この挙動は実験的なものであり、将来的に変更されうる。
                */
            seethrough: boolean;
            /**
                * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
                */
            onUpdate: Trigger<void>;
            /**
                * 読み込み完了イベント。
                *
                * このシーンの生成時に(コンストラクタで)指定されたすべてのアセットの読み込みが終了した後、一度だけfireされる。
                * このシーンのアセットを利用するすべての処理は、このイベントのfire後に実行されなければならない。
                */
            onLoad: Trigger<Scene>;
            /**
                * アセット読み込み成功イベント。
                *
                * このシーンのアセットが一つ読み込まれる度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                */
            onAssetLoad: Trigger<Asset>;
            /**
                * アセット読み込み失敗イベント。
                *
                * このシーンのアセットが一つ読み込みに失敗する度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                * このイベントをhandleする場合、ハンドラは `AssetLoadFailureInfo#cancelRetry` を真にすることでゲーム続行を断念することができる。
                */
            onAssetLoadFailure: Trigger<AssetLoadFailureInfo>;
            /**
                * アセット読み込み完了イベント。
                *
                * このシーンのアセットが一つ読み込みに失敗または成功する度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                */
            onAssetLoadComplete: Trigger<Asset>;
            /**
                * シーンの状態。
                */
            state: SceneStateString;
            /**
                * シーンの状態変更イベント。
                * 状態が初期化直後の `"standby"` 状態以外に変化するときfireされる。
                */
            onStateChange: Trigger<SceneStateString>;
            /**
                * 汎用メッセージイベント。
                */
            onMessage: Trigger<MessageEvent>;
            /**
                * シーン内でのpoint downイベント。
                *
                * このイベントは `E#onPointDown` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint downイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                */
            onPointDownCapture: Trigger<PointDownEvent>;
            /**
                * シーン内でのpoint moveイベント。
                *
                * このイベントは `E#onPointMove` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint moveイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                */
            onPointMoveCapture: Trigger<PointMoveEvent>;
            /**
                * シーン内でのpoint upイベント。
                *
                * このイベントは `E#onPointUp` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint upイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                */
            onPointUpCapture: Trigger<PointUpEvent>;
            /**
                * シーン内での操作イベント。
                */
            onOperation: Trigger<OperationEvent>;
            /**
                * 時間経過イベント。本イベントの一度のfireにつき、常に1フレーム分の時間経過が起こる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onUpdate` を利用すること。
                */
            update: Trigger<void>;
            /**
                * 読み込み完了イベント。
                *
                * このシーンの生成時に(コンストラクタで)指定されたすべてのアセットの読み込みが終了した後、一度だけfireされる。
                * このシーンのアセットを利用するすべての処理は、このイベントのfire後に実行されなければならない。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onLoad` を利用すること。
                */
            loaded: Trigger<Scene>;
            /**
                * アセット読み込み成功イベント。
                *
                * このシーンのアセットが一つ読み込まれる度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onAssetLoad` を利用すること。
                */
            assetLoaded: Trigger<Asset>;
            /**
                * アセット読み込み失敗イベント。
                *
                * このシーンのアセットが一つ読み込みに失敗する度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                * このイベントをhandleする場合、ハンドラは `AssetLoadFailureInfo#cancelRetry` を真にすることでゲーム続行を断念することができる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onAssetLoadFailure` を利用すること。
                */
            assetLoadFailed: Trigger<AssetLoadFailureInfo>;
            /**
                * アセット読み込み完了イベント。
                *
                * このシーンのアセットが一つ読み込みに失敗または成功する度にfireされる。
                * アセット読み込み中の動作をカスタマイズしたい場合に用いる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onAssetLoadComplete` を利用すること。
                */
            assetLoadCompleted: Trigger<Asset>;
            /**
                * 汎用メッセージイベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onMessage` を利用すること。
                */
            message: Trigger<MessageEvent>;
            /**
                * シーン内でのpoint downイベント。
                *
                * このイベントは `E#onPointDown` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint downイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointDownCapture` を利用すること。
                */
            pointDownCapture: Trigger<PointDownEvent>;
            /**
                * シーン内でのpoint moveイベント。
                *
                * このイベントは `E#onPointMove` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint moveイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointMoveCapture` を利用すること。
                */
            pointMoveCapture: Trigger<PointMoveEvent>;
            /**
                * シーン内でのpoint upイベント。
                *
                * このイベントは `E#onPointUp` とは独立にfireされる。
                * すなわち、シーン内に同じ位置でのpoint upイベントに反応する `E` がある場合もない場合もこのイベントはfireされる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onPointUpCapture` を利用すること。
                */
            pointUpCapture: Trigger<PointUpEvent>;
            /**
                * シーン内での操作イベント。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onOperation` を利用すること。
                */
            operation: Trigger<OperationEvent>;
            /**
                * ゲーム開発者向けのコンテナ。
                *
                * この値はゲームエンジンのロジックからは使用されず、ゲーム開発者は任意の目的に使用してよい。
                */
            vars: any;
            /**
                * アセットとストレージの読み込みが終わったことを通知するTrigger。
                * @private
                */
            _onReady: Trigger<Scene>;
            /**
                * アセットとストレージの読み込みが終わったことを通知するTrigger。
                * @private
                * @deprecated 非推奨である。将来的に削除される。代わりに `_onReady` を利用すること。
                */
            _ready: Trigger<Scene>;
            /**
                * 読み込みが開始されたか否か。
                * すなわち、 `_load()` が呼び出された後か否か。
                *
                * 歴史的経緯により、このフラグの意味は「読み込みが終わった後」でも「onLoadがfireされた後」でもない点に注意。
                * なお前者「(アセットとストレージの)読み込みが終わった後」は `_loadingState === "ready"` に与えられる。
                *
                * シーンの読み込みは概ね次の順で処理が進行する。
                * * `_loaded` が真になる
                * * 各種読み込みが完了する
                * * `_loadingState` が `"ready"` になる
                * * `_onReady` がfireされる
                * * `_loadingState` が `"ready-fired"` になる
                * * `onLoad` がfireされる
                * * `_loadingState` が `"loaded-fired"` になる
                * @private
                */
            _loaded: boolean;
            /**
                * 先読みが要求されたか否か。
                * すなわち、 `prefetch()` が呼び出された後か否か。
                * @private
                */
            _prefetchRequested: boolean;
            /**
                * アセットとストレージの読み込みが終わった後か否か。
                * 「 `onLoad` がfireされた後」ではない点に注意。
                * @private
                */
            _loadingState: SceneLoadStateString;
            /**
                * タイマー。通常は本変数直接ではなく、createTimer/deleteTimer/setInterval/clearInterval等の機構を利用する。
                * @private
                */
            _timer: TimerManager;
            /**
                * シーンのアセットの保持者。
                * @private
                */
            _sceneAssetHolder: AssetHolder<SceneRequestAssetHandler>;
            /**
                * `Scene#requestAssets()` で動的に要求されたアセットの保持者。
                * @private
                */
            _assetHolders: AssetHolder<SceneRequestAssetHandler>[];
            /**
                * @private
                */
            _waitingPrepare: ((done: () => void) => void) | undefined;
            /**
                * 各種パラメータを指定して `Scene` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: SceneParameterObject);
            /**
                * このシーンが変更されたことをエンジンに通知する。
                *
                * このメソッドは、このシーンに紐づいている `E` の `modified()` を呼び出すことで暗黙に呼び出される。
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * @param _isBubbling この関数をこのシーンの子の `modified()` から呼び出す場合、真を渡さなくてはならない。省略された場合、偽。
                */
            modified(_isBubbling?: boolean): void;
            /**
                * このシーンを破棄する。
                *
                * 破棄処理の開始時に、このシーンの `onStateChange` が引数 `BeforeDestroyed` でfireされる。
                * 破棄処理の終了時に、このシーンの `onStateChange` が引数 `Destroyed` でfireされる。
                * このシーンに紐づいている全ての `E` と全てのTimerは破棄される。
                * `Scene#setInterval()`, `Scene#setTimeout()` に渡された関数は呼び出されなくなる。
                *
                * このメソッドは `Scene#end` や `Game#popScene` などによって要求されたシーンの遷移時に暗黙に呼び出される。
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                */
            destroy(): void;
            /**
                * 破棄済みであるかを返す。
                */
            destroyed(): boolean;
            /**
                * 一定間隔で定期的に処理を実行するTimerを作成して返す。
                *
                * 戻り値は作成されたTimerである。
                * 通常は `Scene#setInterval` を利用すればよく、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * `Timer` はフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
                * @param interval Timerの実行間隔（ミリ秒）
                */
            createTimer(interval: number): Timer;
            /**
                * Timerを削除する。
                * `Scene#createTimer()`と同様に、通常はゲーム開発者がこのメソッドを呼び出す必要はない。
                * このメソッドを利用する場合、メソッド実行前に対象のTimerのonElapseに登録したハンドラを全て削除しておく必要がある。
                * @param timer 削除するTimer
                */
            deleteTimer(timer: Timer): void;
            /**
                * 一定間隔で定期的に実行される処理を作成する。
                *
                * `interval` ミリ秒おきに `owner` を `this` として `handler` を呼び出す。
                * 戻り値は `Scene#clearInterval` の引数に指定して定期実行を解除するために使える値である。
                * このタイマーはフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
                * 関数は指定時間の経過直後ではなく、経過後最初のフレームで呼び出される。
                * @param handler 処理
                * @param interval 実行間隔(ミリ秒)
                * @param owner handlerの所有者。省略された場合、null
                */
            setInterval(handler: () => void, interval: number, owner?: any): TimerIdentifier;
            /**
                * setIntervalで作成した定期処理を解除する。
                * @param identifier 解除対象
                */
            clearInterval(identifier: TimerIdentifier): void;
            /**
                * 一定時間後に一度だけ実行される処理を作成する。
                *
                * `milliseconds` ミリ秒後(以降)に、一度だけ `owner` を `this` として `handler` を呼び出す。
                * 戻り値は `Scene#clearTimeout` の引数に指定して処理を削除するために使える値である。
                *
                * このタイマーはフレーム経過処理(`Scene#onUpdate`)で実現される疑似的なタイマーである。実時間の影響は受けない。
                * 関数は指定時間の経過直後ではなく、経過後最初のフレームで呼び出される。
                * (理想的なケースでは、30FPSなら50msのコールバックは66.6ms時点で呼び出される)
                * 時間経過に対して厳密な処理を行う必要があれば、自力で `Scene#onUpdate` 通知を処理すること。
                *
                * @param handler 処理
                * @param milliseconds 時間(ミリ秒)
                * @param owner handlerの所有者。省略された場合、null
                */
            setTimeout(handler: () => void, milliseconds: number, owner?: any): TimerIdentifier;
            /**
                * setTimeoutで作成した処理を削除する。
                * @param identifier 解除対象
                */
            clearTimeout(identifier: TimerIdentifier): void;
            /**
                * このシーンが現在のシーンであるかどうかを返す。
                */
            isCurrentScene(): boolean;
            /**
                * 次のシーンへの遷移を要求する。
                *
                * このメソッドは、 `toPush` が真ならば `Game#pushScene()` の、でなければ `Game#replaceScene` のエイリアスである。
                * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
                * このシーンが現在のシーンでない場合、 `AssertionError` がthrowされる。
                * @param next 遷移後のシーン
                * @param toPush 現在のシーンを残したままにするなら真、削除して遷移するなら偽を指定する。省略された場合偽
                */
            gotoScene(next: Scene, toPush?: boolean): void;
            /**
                * このシーンの削除と、一つ前のシーンへの遷移を要求する。
                *
                * このメソッドは `Game#popScene()` のエイリアスである。
                * このメソッドは要求を行うだけである。呼び出し直後にはシーン遷移は行われていないことに注意。
                * このシーンが現在のシーンでない場合、 `AssertionError` がthrowされる。
                */
            end(): void;
            /**
                * このSceneにエンティティを登録する。
                *
                * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に呼び出す必要はない。
                * @param e 登録するエンティティ
                */
            register(e: E): void;
            /**
                * このSceneからエンティティの登録を削除する。
                *
                * このメソッドは各エンティティに対して暗黙に呼び出される。ゲーム開発者がこのメソッドを明示的に呼び出す必要はない。
                * @param e 登録を削除するエンティティ
                */
            unregister(e: E): void;
            /**
                * 子エンティティを追加する。
                *
                * `this.children` の末尾に `e` を追加する(`e` はそれまでに追加されたすべての子エンティティより手前に表示される)。
                *
                * @param e 子エンティティとして追加するエンティティ
                */
            append(e: E): void;
            /**
                * 子エンティティを挿入する。
                *
                * `this.children` の`target`の位置に `e` を挿入する。
                * `target` が`this` の子でない場合、`append(e)`と同じ動作となる。
                *
                * @param e 子エンティティとして追加するエンティティ
                * @param target 挿入位置にある子エンティティ
                */
            insertBefore(e: E, target: E | undefined): void;
            /**
                * 子エンティティを削除する。
                * `this` の子から `e` を削除する。 `e` が `this` の子でない場合、何もしない。
                * @param e 削除する子エンティティ
                */
            remove(e: E): void;
            /**
                * シーン内でその座標に反応する `PointSource` を返す。
                * @param point 対象の座標
                * @param force touchable指定を無視する場合真を指定する。指定されなかった場合偽
                * @param camera 対象のカメラ。指定されなかった場合undefined
                */
            findPointSourceByPoint(point: CommonOffset, force?: boolean, camera?: Camera): PointSource;
            /**
                * アセットの先読みを要求する。
                *
                * `Scene` に必要なアセットは、通常、`Game#pushScene()` などによるシーン遷移にともなって暗黙に読み込みが開始される。
                * ゲーム開発者はこのメソッドを呼び出すことで、シーン遷移前にアセット読み込みを開始する(先読みする)ことができる。
                * 先読み開始後、シーン遷移時までに読み込みが完了していない場合、通常の読み込み処理同様にローディングシーンが表示される。
                */
            prefetch(): void;
            requestAssets(assetIdsOrConf: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[] | SceneRequestAssetsParameterObject, handler: SceneRequestAssetHandler): void;
            /**
                * @private
                */
            _activate(): void;
            /**
                * @private
                */
            _deactivate(): void;
            /**
                * @private
                */
            _needsLoading(): boolean;
            /**
                * @private
                */
            _load(): void;
            /**
                * @private
                */
            _handleSceneAssetLoad(asset: Asset): void;
            /**
                * @private
                */
            _handleSceneAssetLoadFailure(failureInfo: AssetLoadFailureInfo): void;
            /**
                * @private
                */
            _handleSceneAssetLoadFinish(holder: AssetHolder<SceneRequestAssetHandler>, succeed: boolean): void;
            /**
                * @private
                */
            _notifySceneReady(): void;
            /**
                * @private
                */
            _fireReady(): void;
            /**
                * @private
                */
            _fireLoaded(): void;
    }
}

declare module 'g/lib/SnapshotSaveRequest' {
    export interface SnapshotSaveRequest {
            /**
                * ゲームの実行状態を表すスナップショット。
                * JSONとして妥当な値でなければならない。
                */
            snapshot: any;
            /**
                * スナップショット生成時の時刻。
                * `g.TimestampEvent` を利用するゲームの場合、それらと同じ基準の時間情報を与えなければならない。
                */
            timestamp?: number;
    }
}

declare module 'g/lib/SurfaceAtlasSet' {
    import type { CommonSize, ResourceFactory } from "@akashic/pdi-types";
    import type { Glyph } from "g/lib/Glyph";
    import { SurfaceAtlas } from "g/lib/SurfaceAtlas";
    /**
        * SurfaceAtlasが効率よく動作するためのヒント。
        *
        * ゲーム開発者はSurfaceAtlasが効率よく動作するための各種初期値・最大値などを提示できる。
        * SurfaceAtlasはこれを参考にするが、そのまま採用するとは限らない。
        */
    export interface SurfaceAtlasSetHint {
            /**
                * 初期アトラス幅。
                */
            initialAtlasWidth?: number;
            /**
                * 初期アトラス高さ。
                */
            initialAtlasHeight?: number;
            /**
                * 最大アトラス幅。
                */
            maxAtlasWidth?: number;
            /**
                * 最大アトラス高さ。
                */
            maxAtlasHeight?: number;
            /**
                * 最大アトラス保持数。
                */
            maxAtlasNum?: number;
    }
    /**
        * SurfaceAtlasSet のコンストラクタに渡すことができるパラメータ。
        */
    export interface SurfaceAtlasSetParameterObject {
            /**
                * ゲームインスタンス。
                */
            resourceFactory: ResourceFactory;
            /**
                * ヒント。
                *
                * 詳細は `SurfaceAtlasSetHint` を参照。
                */
            hint?: SurfaceAtlasSetHint;
    }
    /**
        * DynamicFont で使用される SurfaceAtlas を管理するクラス。
        *
        * 歴史的経緯のため、名前に反して DynamicFont 専用のクラスであり、汎用の SurfaceAtlas 管理クラスではない点に注意。
        */
    export class SurfaceAtlasSet {
            /**
                * SurfaceAtlas最大保持数初期値
                */
            static INITIAL_MAX_SURFACEATLAS_NUM: number;
            /**
                * @private
                */
            _surfaceAtlases: SurfaceAtlas[];
            /**
                * @private
                */
            _atlasGlyphsTable: Glyph[][];
            /**
                * @private
                */
            _maxAtlasNum: number;
            /**
                * @private
                */
            _resourceFactory: ResourceFactory;
            /**
                * @private
                */
            _atlasSize: CommonSize;
            /**
                * @private
                */
            _currentAtlasIndex: number;
            constructor(params: SurfaceAtlasSetParameterObject);
            /**
                * @private
                */
            _deleteAtlas(delteNum: number): void;
            /**
                * surfaceAtlases の最も利用されていない SurfaceAtlas を探し、 そのインデックスを返す。
                *
                * _surfaceAtlases の長さが 0 の場合、 -1 を返す。
                * @private
                */
            _findLeastFrequentlyUsedAtlasIndex(): number;
            /**
                * surfaceAtlases の最も利用されていない SurfaceAtlas を切り離して返す。
                *
                * 返された SurfaceAtlas に紐づいていたすべての Glyph はサーフェスを失う (_isSurfaceValid が偽になる) 。
                * _surfaceAtlases の長さが 0 の場合、 何もせず null を返す。
                * @private
                */
            _spliceLeastFrequentlyUsedAtlas(): SurfaceAtlas | null;
            /**
                * 空き領域のある SurfaceAtlas を探索する。
                * glyph が持つ情報を SurfaceAtlas へ移動し、移動した SurfaceAtlas の情報で glyph を置き換える。
                * glyph が持っていた surface は破棄される。
                *
                * 移動に成功した場合 `true` を、失敗した (空き領域が見つからなかった) 場合 `false` を返す。
                * @private
                */
            _moveGlyphSurface(glyph: Glyph): boolean;
            /**
                * サーフェスアトラスの再割り当てを行う。
                * @private
                */
            _reallocateAtlas(): void;
            /**
                * 引数で指定されたindexのサーフェスアトラスを取得する。
                *
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * @param index 取得対象のインデックス
                */
            getAtlas(index: number): SurfaceAtlas;
            /**
                * サーフェスアトラスの保持数を取得する。
                *
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                */
            getAtlasNum(): number;
            /**
                * 最大サーフェスアトラス保持数取得する。
                */
            getMaxAtlasNum(): number;
            /**
                * 最大アトラス保持数設定する。
                *
                * 設定された値が、現在保持している_surfaceAtlasesの数より大きい場合、
                * removeLeastFrequentlyUsedAtlas()で設定値まで削除する。
                * @param value 設定値
                */
            changeMaxAtlasNum(value: number): void;
            /**
                * サーフェスアトラスのサイズを取得する。
                *
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                */
            getAtlasUsedSize(): CommonSize;
            /**
                * グリフを追加する。
                *
                * glyph が持っていたサーフェスは破棄され、このクラスが管理するいずれかの (サーフェスアトラスの) サーフェスに紐づけられる。
                * 追加に成功した場合 `true` を、失敗した (空き領域が見つからなかった) 場合 `false` を返す。
                *
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * @param glyph グリフ
                */
            addGlyph(glyph: Glyph): boolean;
            /**
                * グリフの利用を通知する。
                *
                * サーフェスが不足した時、このクラスは最も利用頻度の低いサーフェスを解放して再利用する。
                * このメソッドによるグリフの利用通知は、利用頻度の低いサーフェスを特定するために利用される。
                *
                * 通常、ゲーム開発者がこのメソッドを呼び出す必要はない。
                * @param glyph グリフ
                */
            touchGlyph(glyph: Glyph): void;
            /**
                * このインスタンスを破棄する。
                */
            destroy(): void;
            /**
                * このインスタンスが破棄済みであるかどうかを返す。
                */
            destroyed(): boolean;
    }
}

declare module 'g/lib/TickGenerationModeString' {
    /**
      * シーンにおいて、時間経過の契機 (ティック) をどのように生成するか。
      * ただしローカルティック (ローカルシーン中などの「各プレイヤー間で独立な時間経過処理」) はこのモードの影響を受けない。
      *
      * - `"by-clock"`: 実際の時間経過に従う。
      * - `"manual"`: コンテンツが生成する。
      *
      * `"manual"` を指定した `Scene` においては、 `Game#raiseTick()` を呼び出さない限り時間経過が起きない。
      */
    export type TickGenerationModeString = "by-clock" | "manual";
}

declare module 'g/lib/WeakRefKVS' {
    interface WeakRefLike<T extends object> {
            deref(): T | undefined;
    }
    /**
        * 対象の値を弱参照として保持する Key-Value 型データストア。
        * 通常、ゲーム開発者はこのクラスを利用する必要はない。
        */
    export class WeakRefKVS<T extends object> {
            /**
                * @ignore
                */
            _weakRefClass: any;
            /**
                * @ignore
                */
            _refMap: {
                    [key: string]: WeakRefLike<T>;
            };
            set(key: string | number, value: T): void;
            get(key: string | number): T | undefined;
            has(key: string | number): boolean;
            delete(key: string | number): void;
            keys(): string[];
            clear(): void;
            /**
                * 参照されなくなった target のキーをマップから削除する。
                */
            clean(): void;
    }
    export {};
}

declare module 'g/lib/index.common' {
    export * from "@akashic/game-configuration";
    export * from "@akashic/trigger";
    export * from "@akashic/pdi-types";
    export { AudioSystem } from "g/lib/AudioSystem";
    export { Glyph } from "g/lib/Glyph";
    export { Module } from "g/lib/Module";
    export { ShaderProgram } from "g/lib/ShaderProgram";
    export { VideoSystem } from "g/lib/VideoSystem";
    export { PathUtil } from "@akashic/game-configuration/lib/utils/PathUtil";
    export * from "g/lib/entities/CacheableE";
    export * from "g/lib/entities/E";
    export * from "g/lib/entities/FilledRect";
    export * from "g/lib/entities/FrameSprite";
    export * from "g/lib/entities/Label";
    export * from "g/lib/entities/Pane";
    export * from "g/lib/entities/Sprite";
    export * from "g/lib/errors";
    export * from "g/lib/AssetAccessor";
    export * from "g/lib/AssetGenerationConfiguration";
    export * from "g/lib/AssetHolder";
    export * from "g/lib/AssetLoadFailureInfo";
    export * from "g/lib/AssetManager";
    export * from "g/lib/AssetManagerLoadHandler";
    export * from "g/lib/AudioPlayContext";
    export * from "g/lib/AudioSystem";
    export * from "g/lib/AudioSystemManager";
    export * from "g/lib/AudioUtil";
    export * from "g/lib/BitmapFont";
    export * from "g/lib/Camera";
    export * from "g/lib/Camera2D";
    export * from "g/lib/Collision";
    export * from "g/lib/DefaultLoadingScene";
    export * from "g/lib/DefaultSkippingScene";
    export * from "g/lib/DynamicAssetConfiguration";
    export * from "g/lib/DynamicFont";
    export * from "g/lib/EntityStateFlags";
    export * from "g/lib/Event";
    export * from "g/lib/EventConverter";
    export * from "g/lib/EventFilter";
    export * from "g/lib/EventFilterController";
    export * from "g/lib/EventIndex";
    export * from "g/lib/EventPriority";
    export * from "g/lib/ExceptionFactory";
    export * from "g/lib/Font";
    export * from "g/lib/GameMainParameterObject";
    export * from "g/lib/InitialScene";
    export * from "g/lib/InternalOperationPluginInfo";
    export * from "g/lib/LoadingScene";
    export * from "g/lib/LocalTickModeString";
    export * from "g/lib/Matrix";
    export * from "g/lib/Module";
    export * from "g/lib/ModuleManager";
    export * from "g/lib/NinePatchSurfaceEffector";
    export * from "g/lib/Object2D";
    export * from "g/lib/OperationPlugin";
    export * from "g/lib/OperationPluginManager";
    export * from "g/lib/OperationPluginOperation";
    export * from "g/lib/OperationPluginStatic";
    export * from "g/lib/Player";
    export * from "g/lib/PointEventResolver";
    export * from "g/lib/RandomGenerator";
    export * from "g/lib/Require";
    export * from "g/lib/RequireCacheable";
    export * from "g/lib/RequireCachedValue";
    export * from "g/lib/ScriptAssetContext";
    export * from "g/lib/ShaderProgram";
    export * from "g/lib/SnapshotSaveRequest";
    export * from "g/lib/SpriteFactory";
    export * from "g/lib/SurfaceAtlas";
    export * from "g/lib/SurfaceAtlasSet";
    export * from "g/lib/SurfaceAtlasSlot";
    export * from "g/lib/SurfaceEffector";
    export * from "g/lib/SurfaceUtil";
    export * from "g/lib/TextAlign";
    export * from "g/lib/TextAlignString";
    export * from "g/lib/TextMetrics";
    export * from "g/lib/TickGenerationModeString";
    export * from "g/lib/Timer";
    export * from "g/lib/TimerManager";
    export * from "g/lib/Util";
    export * from "g/lib/VideoSystem";
    export * from "g/lib/WeakRefKVS";
    export * from "g/lib/Xorshift";
    export * from "g/lib/XorshiftRandomGenerator";
    export * from "g/lib/Scene";
    export * from "g/lib/Game";
}

declare module 'g/lib/AssetGenerationConfiguration' {
    import type { AssetConfigurationCommonBase } from "@akashic/game-configuration";
    export type AssetGenerationConfiguration = VectorImageAssetGenerationConfiguration;
    /**
        * Asset を動的に生成するための設定を表すインターフェース。
        */
    export interface AssetGenerationConfigurationBase extends AssetConfigurationCommonBase {
            /**
                * このアセットのIDとして用いる値。
                * この値はひとつのAssetManagerの中でユニークでなければならない。
                */
            id: string;
    }
    /**
        * VectorImageAsset を動的生成するための設定。
        */
    export interface VectorImageAssetGenerationConfiguration extends Omit<AssetGenerationConfigurationBase, "type"> {
            type: "vector-image";
            data: string;
    }
}

declare module 'g/lib/AssetManagerLoadHandler' {
    import type { Asset, AssetLoadError } from "@akashic/pdi-types";
    /**
        * `AssetManager` から `Asset` の読み込みまたは読み込み失敗を受け取るハンドラのインターフェース定義。
        * `AssetLoadHandler` とは異なる。こちらは `AssetManager` を経由してのアセットの読み込み処理を行う場合のハンドラである。
        */
    export interface AssetManagerLoadHandler {
            /**
                * 読み込失敗の通知を受ける関数。
                * @ignore
                * @param asset 読み込みに失敗したアセット
                * @param error 失敗の内容を表すエラー
                * @param retryCallback 読み込みの再試行を行うコールバック関数。`AssetManager#retryLoad()` が設定される。
                */
            _onAssetError(asset: Asset, error: AssetLoadError, retryCallback: (asset: Asset) => void): void;
            /**
                * 読み込み完了の通知を受ける関数。
                * @ignore
                * @param asset 読み込みが完了したアセット
                */
            _onAssetLoad(asset: Asset): void;
    }
}

declare module 'g/lib/AudioSystem' {
    import type { AudioAsset, AudioPlayer, AudioPlayerEvent, ResourceFactory, AudioSystem as PdiAudioSystem } from "@akashic/pdi-types";
    import { AudioPlayContext } from "g/lib/AudioPlayContext";
    import { WeakRefKVS } from "g/lib/WeakRefKVS";
    export interface AudioSystemParameterObject {
            /**
                * オーディオシステムのID
                */
            id: string;
            /**
                * オーディオのボリューム
                */
            volume?: number;
            /**
                * ミュート中か否か。
                */
            muted?: boolean;
            /**
                * 各種リソースのファクトリ
                */
            resourceFactory: ResourceFactory;
    }
    export abstract class AudioSystem implements PdiAudioSystem {
            id: string;
            /**
                * @private
                */
            _volume: number;
            /**
                * @private
                */
            _muted: boolean;
            /**
                * @private
                */
            _destroyRequestedAssets: {
                    [key: string]: AudioAsset;
            };
            /**
                * 再生速度が等倍以外に指定された等の要因により、音声再生が抑制されているかどうか。
                * @private
                */
            _suppressed: boolean;
            /**
                * @private
                */
            _resourceFactory: ResourceFactory;
            /**
                * 明示的に設定された、ミュート中か否か。
                * @private
                */
            _explicitMuted: boolean;
            /**
                * @private
                */
            _contextMap: WeakRefKVS<AudioPlayContext>;
            /**
                * @private
                */
            _contextCount: number;
            /**
                * `this._contextMap` から不要な参照を削除する頻度。
                * 10 を指定した場合 `AudioPlayContext` を 10 回生成する度に参照の削除が行われる。
                * @private
                */
            abstract _contentMapCleaningFrequency: number;
            get volume(): number;
            set volume(value: number);
            constructor(param: AudioSystemParameterObject);
            play(asset: AudioAsset): AudioPlayContext;
            create(asset: AudioAsset): AudioPlayContext;
            stopAll(): void;
            abstract findPlayers(asset: AudioAsset): AudioPlayer[];
            abstract createPlayer(): AudioPlayer;
            requestDestroy(asset: AudioAsset): void;
            /**
                * `this.requestDestroy()` により破棄要求されているアセットの破棄を取り消す。
                * @param asset アセット。
                */
            cancelRequestDestroy(asset: AudioAsset): void;
            /**
                * `this.requestDestroy()` により破棄要求されていて、まだ実際には破棄されていないアセット。
                * 対象のアセットが破棄要求されていなければ `null` を返す。
                * @param assetId アセットID。
                */
            getDestroyRequestedAsset(assetId: string): AudioAsset | null;
            /**
                * @private
                */
            _reset(): void;
            /**
                * @private
                */
            _setMuted(value: boolean): void;
            /**
                * @private
                */
            _setPlaybackRate(value: number): void;
            /**
                * @private
                */
            _updateMuted(): void;
            /**
                * @private
                */
            _generateAudioPlayContextId(): string;
            /**
                * @private
                */
            _startSuppress(): void;
            /**
                * @private
                */
            _endSuppress(): void;
            /**
                * @private
                */
            abstract _onVolumeChanged(): void;
            /**
                * @private
                */
            abstract _onMutedChanged(): void;
            /**
                * @private
                */
            abstract _onPlaybackRateChanged(): void;
    }
    export class MusicAudioSystem extends AudioSystem {
            /**
                * @private
                */
            _player: AudioPlayer | undefined;
            /**
                * @private
                */
            _contentMapCleaningFrequency: number;
            get player(): AudioPlayer;
            set player(v: AudioPlayer);
            constructor(param: AudioSystemParameterObject);
            findPlayers(asset: AudioAsset): AudioPlayer[];
            createPlayer(): AudioPlayer;
            stopAll(): void;
            /**
                * @private
                */
            _reset(): void;
            /**
                * @private
                */
            _onVolumeChanged(): void;
            /**
                * @private
                */
            _onMutedChanged(): void;
            /**
                * @private
                */
            _onPlaybackRateChanged(): void;
            /**
                * @private
                */
            _handlePlay(e: AudioPlayerEvent): void;
            /**
                * @private
                */
            _handleStop(e: AudioPlayerEvent): void;
    }
    export class SoundAudioSystem extends AudioSystem {
            players: AudioPlayer[];
            /**
                * @private
                */
            _contentMapCleaningFrequency: number;
            constructor(param: AudioSystemParameterObject);
            createPlayer(): AudioPlayer;
            findPlayers(asset: AudioAsset): AudioPlayer[];
            stopAll(): void;
            /**
                * @private
                */
            _reset(): void;
            /**
                * @private
                */
            _onMutedChanged(): void;
            /**
                * @private
                */
            _onPlaybackRateChanged(): void;
            /**
                * @private
                */
            _handlePlay(_e: AudioPlayerEvent): void;
            /**
                * @private
                */
            _handleStop(e: AudioPlayerEvent): void;
            /**
                * @private
                */
            _onVolumeChanged(): void;
    }
}

declare module 'g/lib/DynamicAssetConfiguration' {
    import type { AssetConfigurationCommonBase, AudioAssetConfigurationBase, BinaryAssetConfigurationBase, ImageAssetConfigurationBase, ScriptAssetConfigurationBase, TextAssetConfigurationBase, VectorImageAssetConfigurationBase, VideoAssetConfigurationBase } from "@akashic/game-configuration";
    export type DynamicAssetConfiguration = DynamicAudioAssetConfigurationBase | DynamicImageAssetConfigurationBase | DynamicVectorImageAssetConfigurationBase | DynamicTextAssetConfigurationBase | DynamicScriptAssetConfigurationBase | DynamicVideoAssetConfigurationBase | DynamicBinaryAssetConfigurationBase;
    /**
        * (実行時に定義される)Assetの設定を表すインターフェース。
        * game.jsonに記述される値の型ではない点に注意。
        */
    export interface DynamicAssetConfigurationBase extends AssetConfigurationCommonBase {
            /**
                * このアセットのIDとして用いる値。
                * この値はひとつのAssetManagerの中でユニークでなければならない。
                */
            id: string;
            /**
                * Assetを表すファイルのURI。
                */
            uri: string;
    }
    /**
        * ImageAssetの設定。
        */
    export interface DynamicImageAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<ImageAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * VectorImageAssetの設定。
        */
    export interface DynamicVectorImageAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<VectorImageAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * VideoAssetの設定。
        */
    export interface DynamicVideoAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<VideoAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * AudioAssetの設定。
        */
    export interface DynamicAudioAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<AudioAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * TextAssetの設定。
        */
    export interface DynamicTextAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<TextAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * ScriptAssetの設定。
        */
    export interface DynamicScriptAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<ScriptAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    /**
        * BinaryAssetの設定。
        */
    export interface DynamicBinaryAssetConfigurationBase extends Omit<DynamicAssetConfigurationBase, "type">, Omit<BinaryAssetConfigurationBase, UnneededKeysForDynamicAsset> {
    }
    type UnneededKeysForDynamicAsset = "path" | "virtualPath" | "global";
    export {};
}

declare module 'g/lib/AudioPlayContext' {
    import type { AudioAsset, AudioPlayer, AudioSystem, ResourceFactory } from "@akashic/pdi-types";
    import { Trigger } from "@akashic/trigger";
    export interface AudioPlayContextPlayEvent {
    }
    export interface AudioPlayContextStopEvent {
    }
    export interface AudioPlayContextParameterObject {
            id: string;
            resourceFactory: ResourceFactory;
            system: AudioSystem;
            systemId: string;
            asset: AudioAsset;
            volume?: number;
    }
    export class AudioPlayContext {
            /**
                * この AudioPlayContext に紐づく音声アセット。
                */
            readonly asset: AudioAsset;
            /**
                * `play()` が呼び出された時に通知される `Trigger` 。
                */
            readonly onPlay: Trigger<AudioPlayContextPlayEvent>;
            /**
                * `stop()` が呼び出された時に通知される `Trigger` 。
                */
            readonly onStop: Trigger<AudioPlayContextStopEvent>;
            /**
                * @private
                */
            _system: AudioSystem;
            /**
                * @private
                */
            _resourceFactory: ResourceFactory;
            /**
                * @private
                */
            _player: AudioPlayer;
            /**
                * @private
                */
            _volume: number;
            /**
                * @private
                */
            _id: string;
            /**
                * @private
                */
            _systemId: string;
            get volume(): number;
            constructor(param: AudioPlayContextParameterObject);
            play(): void;
            stop(): void;
            changeVolume(vol: number): void;
            /**
                * @private
                */
            _startSuppress(): void;
            /**
                * @private
                */
            _endSuppress(): void;
    }
}

declare module 'g/lib/EntityStateFlags' {
    /**
        * 状態のビットフラグを表す数値。
        */
    export const enum EntityStateFlags {
            /**
                * 特にフラグが立っていない状態。
                */
            None = 0,
            /**
                * 非表示フラグ。
                */
            Hidden = 1,
            /**
                * 描画結果がキャッシュ済みであることを示すフラグ。
                */
            Cached = 2,
            /**
                * modifiedされ、描画待ちであることを示すフラグ。
                */
            Modified = 4,
            /**
                * 軽量な描画処理を利用できることを示すフラグ。
                */
            ContextLess = 8
    }
}

declare module 'g/lib/Matrix' {
    import type { CommonOffset } from "@akashic/pdi-types";
    /**
        * 変換行列を表すインターフェース。
        * 通常ゲーム開発者が本インターフェースを直接利用する事はない。
        */
    export interface Matrix {
            /**
                * 変更フラグ。
                * 本フラグが立っていても特に何も処理はされない。
                * 本フラグの操作、本フラグを参照して値を再計算することは、いずれも利用する側で適切に処理をする必要がある。
                * @private
                */
            _modified: boolean;
            /**
                * 変換本体。
                * CanvasRenderingContext2D#transformの値と等しい。
                * ```
                *   a c e
                * [ b d f ]
                *   0 0 1
                * ```
                * 配列の添え字では、 a(m11): 0, b(m12): 1, c(m21): 2, d(m22): 3, e(dx): 4, f(dy): 5 となる。
                * 参考: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform
                * @private
                */
            _matrix: [number, number, number, number, number, number];
            /**
                * この変換行列に別の変換行列を右側から掛け合わせる。
                * @param matrix 掛け合わせる変換行列
                */
            multiply(matrix: Matrix): void;
            /**
                * この変換行列に別の変換行列を左側から掛け合わせる。
                * @param matrix 掛け合わせる変換行列
                */
            multiplyLeft(matrix: Matrix): void;
            /**
                * この変換行列に別の変換行列を掛け合わせた新しい変換行列を返す。
                * @param matrix 掛け合わせる変換行列
                */
            multiplyNew(matrix: Matrix): Matrix;
            /**
                * 2D object利用の一般的な値を基に変換行列の値を再計算する。
                * @param width 対象の横幅
                * @param height 対象の縦幅
                * @param scaleX 対象の横方向への拡大率
                * @param scaleY 対象の縦方向への拡大率
                * @param angle 角度。単位は `degree` であり `radian` ではない
                * @param x x座標
                * @param y y座標
                * @param anchorX アンカーの横位置。単位は相対値(左端が 0、中央が 0.5、右端が 1.0)である。
                * @param anchorY アンカーの縦位置。単位は相対値(上端が 0、中央が 0.5、下端が 1.0)である。
                */
            update(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number, anchorX: number | null, anchorY: number | null): void;
            /**
                * `update()` によって得られる行列の逆変換になるよう変換行列の値を再計算する。
                * @param width 対象の横幅
                * @param height 対象の縦幅
                * @param scaleX 対象の横方向への拡大率
                * @param scaleY 対象の縦方向への拡大率
                * @param angle 角度。単位は `degree` であり `radian` ではない
                * @param x x座標
                * @param y y座標
                * @param anchorX アンカーの横位置。単位は相対値(左端が 0、中央が 0.5、右端が 1.0)である。
                * @param anchorY アンカーの縦位置。単位は相対値(上端が 0、中央が 0.5、下端が 1.0)である。
                */
            updateByInverse(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number, anchorX: number | null, anchorY: number | null): void;
            /**
                * 値を単位行列にリセットする。x/yの座標情報を初期値に反映させることも出来る。
                * @param x x座標。省略時は0として処理される
                * @param y y座標。省略時は0として処理される
                */
            reset(x?: number, y?: number): void;
            /**
                * この変換行列と同じ値を持つ変換行列を新しく作って返す。
                */
            clone(): Matrix;
            /**
                * 拡縮を変換行列に反映させる。
                * @param x X方向の拡縮律
                * @param y y方向の拡縮律
                */
            scale(x: number, y: number): void;
            /**
                * この変換行列を逆行列に変換した結果を引数の座標系に適用した座標値を返す。
                * この変換行列の値自体や、引数の値は変更されない。
                * @param point 逆行列を適用する座標
                */
            multiplyInverseForPoint(point: CommonOffset): CommonOffset;
            /**
                * この変換行列と引数の座標系が表す行列の積を返す。
                * @param point この変換行列との積を求める座標
                */
            multiplyPoint(point: CommonOffset): CommonOffset;
    }
    /**
        * 変換行列を一般的なJavaScriptのみで表したクラス。
        * 通常ゲーム開発者が本クラスを直接利用する事はない。
        * 各フィールド、メソッドの詳細は `Matrix` インターフェースの説明を参照。
        */
    export class PlainMatrix {
            /**
                * @private
                */
            _modified: boolean;
            /**
                * @private
                */
            _matrix: [number, number, number, number, number, number];
            /**
                * 無変換の変換行列を表す `PlainMatrix` のインスタンスを作成する。
                */
            constructor();
            /**
                * 2Dオブジェクト利用の一般的な値を元に変換行列を表す `PlainMatrix` のインスタンスを生成する。
                * @param width 対象の横幅
                * @param height 対象の縦幅
                * @param scaleX 対象の横方向への拡大率
                * @param scaleY 対象の縦方向への拡大率
                * @param angle 角度。単位は `degree` であり `radian` ではない
                * @param anchorX アンカーの横位置。単位は相対値(左端が 0、中央が 0.5、右端が 1.0)である。
                * @param anchorY アンカーの縦位置。単位は相対値(上端が 0、中央が 0.5、下端が 1.0)である。
                */
            constructor(width: number, height: number, scaleX: number, scaleY: number, angle: number, anchorX: number, anchorY: number);
            /**
                * 指定の `Matrix` と同じ変換行列を表す `PlainMatrix` のインスタンスを生成する。
                */
            constructor(src: Matrix);
            update(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number, anchorX: number | null, anchorY: number | null): void;
            /**
                * このメソッドは anchorX, anchorY が存在しなかった当時との互換性のため存在する。将来この互換性を破棄する時に削除する予定である。
                * @private
                */
            _updateWithoutAnchor(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number): void;
            updateByInverse(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number, anchorX: number | null, anchorY: number | null): void;
            /**
                * このメソッドは anchorX, anchorY が存在しなかった当時との互換性のため存在する。将来この互換性を破棄する時に削除する予定である。
                * @private
                */
            _updateByInverseWithoutAnchor(width: number, height: number, scaleX: number, scaleY: number, angle: number, x: number, y: number): void;
            multiply(matrix: Matrix): void;
            multiplyLeft(matrix: Matrix): void;
            multiplyNew(matrix: Matrix): Matrix;
            reset(x?: number, y?: number): void;
            clone(): Matrix;
            multiplyInverseForPoint(point: CommonOffset): CommonOffset;
            scale(x: number, y: number): void;
            multiplyPoint(point: CommonOffset): CommonOffset;
    }
}

declare module 'g/lib/Object2D' {
    import type { CommonArea, CommonOffset, CommonSize, CompositeOperation, CompositeOperationString } from "@akashic/pdi-types";
    import type { Matrix } from "g/lib/Matrix";
    /**
        * `Object2D` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `Object2D` の同名メンバの説明を参照すること。
        */
    export interface Object2DParameterObject {
            /**
                * このオブジェクトの横位置。実際の座標位置はscaleX, scaleY, angle, anchorX, anchorYの値も考慮する必要がある。
                * @default 0
                */
            x?: number;
            /**
                * このオブジェクトの縦位置。実際の座標位置はscaleX, scaleY, angle, anchorX, anchorYの値も考慮する必要がある。
                * @default 0
                */
            y?: number;
            /**
                * このオブジェクトの横幅。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                * @default 0
                */
            width?: number;
            /**
                * このオブジェクトの縦幅。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                * @default 0
                */
            height?: number;
            /**
                * 0～1でオブジェクトの不透明度を表す。
                * この値が0の場合、Rendererは描画処理を省略する。
                * @default 1
                */
            opacity?: number;
            /**
                * オブジェクトの横方向の倍率。
                * @default 1
                */
            scaleX?: number;
            /**
                * オブジェクトの縦方向の倍率。
                * @default 1
                */
            scaleY?: number;
            /**
                * オブジェクトの回転。度数で指定する。
                * @default 0
                */
            angle?: number;
            /**
                * 描画時の合成方法を指定する。
                * 省略された場合、合成方法を指定しない（親の合成方法を利用する）。
                * なお `CompositeOperation` での指定は非推奨である。 `CompositeOperationString` を利用すること。
                * @default undefined
                */
            compositeOperation?: CompositeOperation | CompositeOperationString;
            /**
                * オブジェクトのアンカーの横位置。アンカーについては以下の通り。
                * * アンカーとして設定した箇所がこのオブジェクトの基点 (位置、拡縮・回転の基点) となる。
                * * 単位は相対値 (左上端が (0, 0) 中央が (0.5, 0,5) 右下端が (1,1) ) である。
                * 初期値は `0` である。
                *
                * NOTE: `anchorX` または `anchorY` のどちらかを明示的に `null` に指定した場合、
                * このオブジェクトのアンカーは前バージョン(v2.x.x 以前)のデフォルトの挙動 (位置 `x`, `y` は左上端を基準に、拡大・縮小・回転の基点は中央を基準に決定) と同様になる。
                * これは前バージョンとの後方互換性のために存在する。
                * * @default 0
                */
            anchorX?: number | null;
            /**
                * オブジェクトのアンカーの縦位置。アンカーについては以下の通り。
                * * アンカーとして設定した箇所がこのオブジェクトの基点 (位置、拡縮・回転の基点) となる。
                * * 単位は相対値 (左上端が (0, 0) 中央が (0.5, 0,5) 右下端が (1,1) ) である。
                * 初期値は `0` である。
                *
                * NOTE: `anchorX` または `anchorY` のどちらを明示的に `null` に指定した場合、
                * このオブジェクトのアンカーは前バージョン(v2.x.x 以前)のデフォルトの挙動 (位置 `x`, `y` は左上端を基準に、拡大・縮小・回転の基点は中央を基準に決定) と同様になる。
                * これは前バージョンとの後方互換性のために存在する。
                * * @default 0
                */
            anchorY?: number | null;
    }
    /**
        * 二次元の幾何的オブジェクト。位置とサイズ (に加えて傾きや透明度も) を持つ。
        * ゲーム開発者は `E` を使えばよく、通常このクラスを意識する必要はない。
        */
    export class Object2D implements CommonArea {
            /**
                * このオブジェクトの横位置。
                * 初期値は `0` である。実際の座標位置はscaleX, scaleY, angle, anchorX, anchorYの値も考慮する必要がある。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            x: number;
            /**
                * このオブジェクトの縦位置。
                * 初期値は `0` である。実際の座標位置はscaleX, scaleY, angle, anchorX, anchorYの値も考慮する必要がある。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            y: number;
            /**
                * このオブジェクトの横幅。
                * 初期値は `0` である。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            width: number;
            /**
                * このオブジェクトの縦幅。
                * 初期値は `0` である。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            height: number;
            /**
                * 0～1でオブジェクトの不透明度を表す。
                * 初期値は `1` である。本値が0の場合、Rendererは描画処理を省略する。
                * `E` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            opacity: number;
            /**
                * オブジェクトの横方向の倍率。
                * 初期値は `1` である。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            scaleX: number;
            /**
                * オブジェクトの縦方向の倍率。
                * 初期値は `1` である。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            scaleY: number;
            /**
                * オブジェクトの回転。度数 (時計回り) で指定する。
                * 初期値は `0` である。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            angle: number;
            /**
                * 描画時の合成方法を指定する。
                * 初期値は `undefined` となり、合成方法を指定しないことを意味する。
                * `E` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                */
            compositeOperation: CompositeOperation | CompositeOperationString | undefined;
            /**
                * オブジェクトのアンカーの横位置。アンカーについては以下の通り。
                * * アンカーとして設定した箇所がこのオブジェクトの基点 (位置、拡縮・回転の基点) となる。
                * * 単位は相対値 (左上端が (0, 0) 中央が (0.5, 0,5) 右下端が (1,1) ) である。
                * 初期値は `0` である。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                *
                * NOTE: `anchorX` または `anchorY` のどちらを明示的に `null` に指定した場合、
                * このオブジェクトのアンカーは前バージョン(v2.x.x 以前)のデフォルトの挙動 (位置 `x`, `y` は左上端を基準に、拡大・縮小・回転の基点は中央を基準に決定) と同様になる。
                * これは前バージョンとの後方互換性のために存在する。
                */
            anchorX: number | null;
            /**
                * オブジェクトのアンカーの縦位置。アンカーについては以下の通り。
                * * アンカーとして設定した箇所がこのオブジェクトの基点 (位置、拡縮・回転の基点) となる。
                * * 単位は相対値 (左上端が (0, 0) 中央が (0.5, 0,5) 右下端が (1,1) ) である。
                * 初期値は `0` である。
                * `E` や `Camera2D` においてこの値を変更した場合、 `modified()` を呼び出す必要がある。
                *
                * NOTE: `anchorX` または `anchorY` のどちらを明示的に `null` に指定した場合、
                * このオブジェクトのアンカーは前バージョン(v2.x.x 以前)のデフォルトの挙動 (位置 `x`, `y` は左上端を基準に、拡大・縮小・回転の基点は中央を基準に決定) と同様になる。
                * これは前バージョンとの後方互換性のために存在する。
                */
            anchorY: number | null;
            /**
                * 変換行列のキャッシュ。 `Object2D` は状態に変更があった時、本値の_modifiedをtrueにする必要がある。
                * 初期値は `undefined` であり、 `getMatrix()` によって必要な時に生成されるため、
                * `if (this._matrix) this._matrix._modified = true` という式で記述する必要がある。
                *
                * エンジンに組み込まれているSprite等のエンティティ群は、
                * すでに本処理を組み込んでいるため通常ゲーム開発者はこの値を意識する必要はない。
                * `Object2D` を継承したクラスを新たに作る場合には、本フィールドを適切に操作しなければならない。
                * @private
                */
            _matrix: Matrix | undefined;
            /**
                * デフォルト値で `Object2D` のインスタンスを生成する。
                */
            constructor();
            /**
                * 指定されたパラメータで `Object2D` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: Object2DParameterObject);
            /**
                * オブジェクトを移動する。
                * このメソッドは `x` と `y` を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param x X座標
                * @param y Y座標
                */
            moveTo(x: number, y: number): void;
            /**
                * オブジェクトを移動する。
                * このメソッドは `x` と `y` を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param obj X,Y座標
                */
            moveTo(obj: CommonOffset): void;
            /**
                * オブジェクトを相対的に移動する。
                * このメソッドは `x` と `y` を同時に加算するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param x X座標に加算する値
                * @param y Y座標に加算する値
                */
            moveBy(x: number, y: number): void;
            /**
                * オブジェクトのサイズを設定する。
                * このメソッドは `width` と `height` を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param width 幅
                * @param height 高さ
                */
            resizeTo(width: number, height: number): void;
            /**
                * オブジェクトのサイズを設定する。
                * このメソッドは `width` と `height` を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param size 幅と高さ
                */
            resizeTo(size: CommonSize): void;
            /**
                * オブジェクトのサイズを相対的に変更する。
                * このメソッドは `width` と `height` を同時に加算するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param width 加算する幅
                * @param height 加算する高さ
                */
            resizeBy(width: number, height: number): void;
            /**
                * オブジェクトの拡大率を設定する。
                * このメソッドは `scaleX` と `scaleY` に同じ値を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                * @param scale 拡大率
                */
            scale(scale: number): void;
            /**
                * オブジェクトのアンカーの位置を設定する。
                * このメソッドは `anchorX` と `anchorY` を同時に設定するためのユーティリティメソッドである。
                * `E` や `Camera2D` においてこのメソッドを呼び出した場合、 `modified()` を呼び出す必要がある。
                */
            anchor(x: number, y: number): void;
            /**
                * このオブジェクトの変換行列を得る。
                */
            getMatrix(): Matrix;
            /**
                * 公開のプロパティから内部の変換行列キャッシュを更新する。
                * @private
                */
            _updateMatrix(): void;
    }
}

declare module 'g/lib/ShaderProgram' {
    import type { ShaderProgram as PdiShaderProgram, ShaderUniform } from "@akashic/pdi-types";
    /**
        * `ShaderProgram` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `ShaderProgram` の同名メンバの説明を参照すること。
        */
    export interface ShaderProgramParameterObject {
            /**
                * フラグメントシェーダの文字列。
                *
                * フラグメントシェーダは GLSL 1.0 に準拠した記述でなければならない。
                * またフラグメントシェーダには以下の varying, uniform 値がエンジンによって与えられる。
                * * uniform float uAlpha
                *   * 描画時の透過度
                * * uniform sampler2D uSampler
                *   * 描画元テクスチャ番号
                * * varying vec2 vTexCoord
                *   * 描画元テクスチャの座標
                *   * gl_FragColor = texture2D(uSampler, vTexCoord); のような形で描画元テクスチャのピクセルを参照できる
                *
                * @default undefined
                */
            fragmentShader?: string;
            /**
                * フラグメントシェーダに指定可能なuniform値のマップ。
                * @default undefined
                */
            uniforms?: {
                    [key: string]: ShaderUniform;
            };
    }
    /**
        * akashic-engineにおけるシェーダ機能を提供するクラス。
        * 現バージョンのakashic-engineではフラグメントシェーダのみをサポートする。
        */
    export class ShaderProgram implements PdiShaderProgram {
            /**
                * フラグメントシェーダの文字列。
                *
                * フラグメントシェーダは GLSL 1.0 に準拠した記述でなければならない。
                * またフラグメントシェーダには以下の varying, uniform 値がエンジンによって与えられる。
                * * uniform float uAlpha
                *   * 描画時の透過度
                * * uniform sampler2D uSampler
                *   * 描画元テクスチャ番号
                * * varying vec2 vTexCoord
                *   * 描画元テクスチャの座標
                *   * gl_FragColor = texture2D(uSampler, vTexCoord); のような形で描画元テクスチャのピクセルを参照できる
                *
                * この値は本クラスの生成時にのみ指定可能であり、直接書き換えてはならない。
                */
            fragmentShader: string | undefined;
            /**
                * 各シェーダに与えられるuniform値のマップ。
                * この値は本クラスの生成時にのみ指定可能であり、 `ShaderUniform#value` 以外の値を直接書き換えてはならない。
                */
            uniforms: {
                    [name: string]: ShaderUniform;
            } | undefined;
            /**
                * シェーダプログラムの実体。
                * @private
                */
            _program: any;
            /**
                * 各種パラメータを指定して `ShaderProgram` のインスタンスを生成する。
                * @param param `ShaderProgram` に設定するパラメータ
                */
            constructor(param: ShaderProgramParameterObject);
    }
}

declare module 'g/lib/Player' {
    /**
      * Playerの情報を表すインターフェース。
      */
    export interface Player {
        id?: string;
        name?: string;
        userData?: any;
    }
}

declare module 'g/lib/EventFilterController' {
    import type { Event } from "@akashic/playlog";
    /**
        * イベントフィルタ内で利用可能なコントローラ。
        */
    export interface EventFilterController {
            /**
                * 引数に指定したイベントを次のイベントフィルタの呼び出し時に処理する。
                * @param pev イベント
                */
            processNext(pev: Event): void;
    }
}

declare module 'g/lib/Module' {
    import type { Module as PdiModule, ScriptAssetRuntimeValue, ScriptAssetRuntimeValueBase } from "@akashic/pdi-types";
    import type { Require } from "g/lib/Require";
    export interface ModuleParameterObject {
            runtimeValueBase: ScriptAssetRuntimeValueBase;
            id: string;
            path: string;
            virtualPath?: string;
            requireFunc: (path: string, currentModule?: Module) => any;
            resolveFunc: (path: string, currentModule?: Module) => string;
    }
    /**
        * Node.js が提供する module の互換クラス。
        */
    export class Module implements PdiModule {
            /**
                * モジュールのID。
                * アセットIDとは異なることに注意。
                */
            id: string;
            /**
                * このモジュールのファイル名。
                * フルパスで与えられる。
                */
            filename: string;
            /**
                * このモジュールが公開する値。
                */
            exports: any;
            /**
                * このモジュールの親。一番最初にこのモジュール (のファイル) を require() したモジュール。
                * 該当するモジュールがなければ `null` である。
                */
            parent: Module | null;
            /**
                * このモジュールの読み込みが完了しているか。
                */
            loaded: boolean;
            /**
                * このモジュールが `require()` したモジュール。
                */
            children: Module[];
            /**
                * このモジュール内で `require()` した時の検索先ディレクトリ。
                */
            paths: string[];
            /**
                * このモジュールの評価時に与えられる `require()` 関数。
                */
            require: Require;
            /**
                * @private
                */
            _dirname: string;
            /**
                * @private
                */
            _virtualDirname: string | undefined;
            /**
                * @private
                */
            _runtimeValue: ScriptAssetRuntimeValue;
            constructor(param: ModuleParameterObject);
    }
}

declare module 'g/lib/RequireCacheable' {
    export interface RequireCacheable {
        /**
          * @private
          */
        _cachedValue: () => any;
    }
}

declare module 'g/lib/OperationPluginStatic' {
    import type { OperationPluginViewInfo } from "@akashic/pdi-types";
    import type { OperationPlugin } from "g/lib/OperationPlugin";
    /**
        * Operation Pluginの実装すべきstatic methodについての定義。
        */
    export interface OperationPluginStatic {
            /**
                * 実行環境がこのpluginをサポートしているか返す。
                */
            isSupported: () => boolean;
            /**
                * OperationPluginを生成する。
                * @param game このプラグインに紐づく `Game`
                * @param viewInfo このプラグインが参照すべきviewの情報。環境によっては `null` でありうる。
                * @param option game.jsonに指定されたこのプラグイン向けのオプション
                */
            new (game: any, viewInfo: OperationPluginViewInfo | null, option?: any): OperationPlugin;
    }
}

declare module 'g/lib/AssetHolder' {
    import type { Asset, AssetLoadError } from "@akashic/pdi-types";
    import type { AssetGenerationConfiguration } from "g/lib/AssetGenerationConfiguration";
    import type { AssetLoadFailureInfo } from "g/lib/AssetLoadFailureInfo";
    import type { AssetManager } from "g/lib/AssetManager";
    import type { DynamicAssetConfiguration } from "g/lib/DynamicAssetConfiguration";
    export interface DestroyedCheckable {
            destroyed(): boolean;
    }
    export interface AssetHolderHandlerSet<UserData> {
            /**
                * 各ハンドラの呼び出し時に this として利用される値。
                */
            owner: DestroyedCheckable;
            /**
                * アセットが一つ読み込まれるたびに呼び出されるハンドラ。
                * @param asset 読み込まれたアセット
                */
            handleLoad: (asset: Asset) => void;
            /**
                * アセットが一つ読み込み失敗するごとに呼び出されるハンドラ。
                * @param failureInfo 読み込み失敗情報
                */
            handleLoadFailure: (failureInfo: AssetLoadFailureInfo) => void;
            /**
                * 全アセットの読み込みを終えた時に呼び出されるハンドラ。
                * @param holder 読み込みを終えた AssetHolder
                * @param succeed 読み込みに成功した場合 true, リトライ不能のエラーで断念した時 false
                */
            handleFinish: (holder: AssetHolder<UserData>, succeed: boolean) => void;
    }
    /**
        * AssetHolder のコンストラクタに指定できるパラメータ。
        * 通常、ゲーム開発者が利用する必要はない。
        */
    export interface AssetHolderParameterObject<UserData> {
            /**
                * アセットの読み込みに利用するアセットマネージャ。
                */
            assetManager: AssetManager;
            /**
                * 読み込むアセット。
                */
            assetIds?: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
            /**
                * 読み込むアセット。
                */
            assetPaths?: string[];
            /**
                * このインスタンスの状態を通知するハンドラ群。
                */
            handlerSet: AssetHolderHandlerSet<UserData>;
            /**
                * このインスタンスに紐づけるユーザ定義データ。
                */
            userData: UserData | null;
            /**
                * エラーが発生したか否かに関わらず常に `handlerSet.handleFinish` を実行するか。
                */
            alwaysNotifyFinish?: boolean;
    }
    /**
        * シーンのアセットの読み込みと破棄を管理するクラス。
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        */
    export class AssetHolder<UserData> {
            /**
                * 読み込みを待つ残りのアセット数。
                * この値は参照のためにのみ公開される。この値を外部から書き換えてはならない。
                */
            waitingAssetsCount: number;
            /**
                * インスタンス生成時に与えられたユーザ定義データ。
                * この値は参照のためにのみ公開される。この値を外部から書き換えてはならない。
                */
            userData: UserData | null;
            /**
                * @private
                */
            _handlerSet: AssetHolderHandlerSet<UserData>;
            /**
                * @private
                */
            _assetManager: AssetManager;
            /**
                * @private
                */
            _assetIds: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
            /**
                * @private
                */
            _assets: Asset[];
            /**
                * @private
                */
            _requested: boolean;
            /**
                * @private
                */
            _alwaysNotifyFinish: boolean;
            /**
                * @private
                */
            _failureAssetIds: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
            constructor(param: AssetHolderParameterObject<UserData>);
            request(): boolean;
            destroy(): void;
            destroyed(): boolean;
            /**
                * @private
                */
            _onAssetError(asset: Asset, error: AssetLoadError): void;
            /**
                * @private
                */
            _onAssetLoad(asset: Asset): void;
            /**
                * @private
                */
            _decrementWaitingAssetCount(): void;
            /**
                * @private
                */
            _getFailureAssetIds(): (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
            /**
                * @private
                */
            _peekAssetConfFromAssetId(id: string): string | DynamicAssetConfiguration | AssetGenerationConfiguration;
    }
}

declare module 'g/lib/AssetLoadFailureInfo' {
    import type { Asset, AssetLoadError } from "@akashic/pdi-types";
    /**
        * `Asset` の読み込み失敗を通知するインターフェース。
        */
    export interface AssetLoadFailureInfo {
            /**
                * 読み込みに失敗したアセット。
                */
            asset: Asset;
            /**
                * 失敗の内容を表すエラー。
                * `error.retriable` が偽である場合、エンジンは強制的にゲーム続行を断念する (`Game#terminateGame()` を行う) 。
                */
            error: AssetLoadError;
            /**
                * 読み込み再試行をキャンセルするかどうか。
                * 初期値は偽である。
                * ゲーム開発者はこの値を真に変更することで、再試行をさせない(ゲーム続行を断念する)ことができる。
                * `error.retriable` が偽である場合、この値の如何にかかわらず再試行は行われない。
                */
            cancelRetry: boolean;
    }
}

declare module 'g/lib/errors' {
    /**
        * akashic-engine 独自のエラー型定義。
        */
    import type { ErrorLike } from "@akashic/pdi-types";
    import type { AssetGenerationConfiguration } from "g/lib/AssetGenerationConfiguration";
    import type { DynamicAssetConfiguration } from "g/lib/DynamicAssetConfiguration";
    /**
        * アセット読み込み失敗の詳細。
        */
    export interface RequestAssetDetail {
            /**
                * 読み込み失敗したアセット ID (またはアセット定義) の配列。
                */
            failureAssetIds: (string | DynamicAssetConfiguration | AssetGenerationConfiguration)[];
    }
    /**
        * アセット読み込み失敗を表すエラー。
        *
        * このエラーは `Scene` 生成時に指定されたアセットの読み込み失敗では発生しないことに注意。
        * `Scene#requestAssets()` によるシーン中の動的なアセットリクエストの失敗時、そのコールバックにのみ通知される。
        */
    export interface RequestAssetLoadError extends ErrorLike {
            name: "RequestAssetLoadError";
            /**
                * 読み込み失敗したリクエストの詳細。
                */
            detail: RequestAssetDetail;
    }
}

declare module 'g/lib/Timer' {
    import { Trigger } from "@akashic/trigger";
    /**
        * 一定時間で繰り返される処理を表すタイマー。
        *
        * ゲーム開発者が本クラスのインスタンスを直接生成することはなく、
        * 通常はScene#setTimeout、Scene#setIntervalによって間接的に利用する。
        */
    export class Timer {
            /**
                * 実行間隔（ミリ秒）。
                * この値は参照のみに利用され、直接値を変更することはできない。
                */
            interval: number;
            /**
                * `this.interval` 経過時にfireされるTrigger。
                */
            onElapse: Trigger<void>;
            /**
                * `this.interval` 経過時にfireされるTrigger。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onElapse` を利用すること。
                */
            elapsed: Trigger<void>;
            /**
                * @private
                */
            _scaledInterval: number;
            /**
                * @private
                */
            _scaledElapsed: number;
            constructor(interval: number, fps: number);
            tick(): void;
            canDelete(): boolean;
            destroy(): void;
            destroyed(): boolean;
    }
}

declare module 'g/lib/TimerManager' {
    import type { Trigger } from "@akashic/trigger";
    import { Timer } from "g/lib/Timer";
    /**
        * `Scene#setTimeout` や `Scene#setInterval` の実行単位を表す。
        * ゲーム開発者が本クラスのインスタンスを直接生成することはなく、
        * 本クラスの機能を直接利用することはない。
        */
    export class TimerIdentifier {
            /**
                * @ignore
                */
            _timer: Timer;
            /**
                * @ignore
                */
            _handler: () => void;
            /**
                * @ignore
                */
            _handlerOwner: any;
            /**
                * @ignore
                */
            _fired: ((c: TimerIdentifier) => void) | undefined;
            /**
                * @ignore
                */
            _firedOwner: any;
            constructor(timer: Timer, handler: () => void, handlerOwner: any, fired?: (c: TimerIdentifier) => void, firedOwner?: any);
            destroy(): void;
            destroyed(): boolean;
            /**
                * @private
                */
            _handleElapse(): void;
    }
    /**
        * Timerを管理する機構を提供する。
        * ゲーム開発者が本クラスを利用する事はない。
        */
    export class TimerManager {
            /**
                * @ignore
                */
            _timers: Timer[];
            /**
                * @ignore
                */
            _trigger: Trigger<void>;
            /**
                * @ignore
                */
            _identifiers: TimerIdentifier[];
            /**
                * @ignore
                */
            _fps: number;
            /**
                * @ignore
                */
            _registered: boolean;
            constructor(trigger: Trigger<void>, fps: number);
            destroy(): void;
            destroyed(): boolean;
            /**
                * 定期間隔で処理を実行するTimerを作成する。
                * 本Timerはフレーム経過によって動作する疑似タイマーであるため、実時間の影響は受けない
                * @param interval Timerの実行間隔（ミリ秒）
                * @returns 作成したTimer
                */
            createTimer(interval: number): Timer;
            /**
                * Timerを削除する。
                * @param timer 削除するTimer
                */
            deleteTimer(timer: Timer): void;
            setTimeout(handler: () => void, milliseconds: number, owner?: any): TimerIdentifier;
            clearTimeout(identifier: TimerIdentifier): void;
            setInterval(handler: () => void, interval: number, owner?: any): TimerIdentifier;
            clearInterval(identifier: TimerIdentifier): void;
            /**
                * すべてのTimerを時間経過させる。
                * @private
                */
            _tick(): void;
            /**
                * @private
                */
            _onTimeoutFired(identifier: TimerIdentifier): void;
            /**
                * @private
                */
            _clear(identifier: TimerIdentifier): void;
    }
}

declare module 'g/lib/Glyph' {
    import type * as pdi from "@akashic/pdi-types";
    import type { SurfaceAtlas } from "g/lib/SurfaceAtlas";
    export interface Glyph extends pdi.Glyph {
        /**
          * @ignore
          * `pdi.Glyph` で `unknown` として予約してあるため、値に型をつける。
          */
        _atlas: SurfaceAtlas | null;
    }
}

declare module 'g/lib/SurfaceAtlas' {
    import type * as pdi from "@akashic/pdi-types";
    import { SurfaceAtlasSlot } from "g/lib/SurfaceAtlasSlot";
    /**
        * サーフェスアトラス。
        *
        * 与えられたサーフェスの指定された領域をコピーし一枚のサーフェスにまとめる。
        *
        * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
        */
    export class SurfaceAtlas {
            /**
                * @private
                */
            _surface: pdi.Surface;
            /**
                * @private
                */
            _emptySurfaceAtlasSlotHead: SurfaceAtlasSlot;
            /**
                * @private
                */
            _accessScore: number;
            /**
                * @private
                */
            _usedRectangleAreaSize: pdi.CommonSize;
            constructor(surface: pdi.Surface);
            reset(): void;
            /**
                * @private
                */
            _acquireSurfaceAtlasSlot(width: number, height: number): SurfaceAtlasSlot | null;
            /**
                * @private
                */
            _updateUsedRectangleAreaSize(slot: SurfaceAtlasSlot): void;
            /**
                * サーフェスを追加する。
                *
                * @param surface 追加するサーフェス
                * @param offsetX サーフェス内におけるX方向のオフセット位置。0以上の数値でなければならない
                * @param offsetY サーフェス内におけるY方向のオフセット位置。0以上の数値でなければならない
                * @param width サーフェス内における矩形の幅。0より大きい数値でなければならない
                * @param height サーフェス内における矩形の高さ。0より大きい数値でなければならない
                */
            addSurface(surface: pdi.Surface, offsetX: number, offsetY: number, width: number, height: number): SurfaceAtlasSlot | null;
            /**
                * このSurfaceAtlasの破棄を行う。
                * 以後、このSurfaceを利用することは出来なくなる。
                */
            destroy(): void;
            /**
                * このSurfaceAtlasが破棄済であるかどうかを判定する。
                */
            destroyed(): boolean;
            /**
                * このSurfaceAtlasの大きさを取得する。
                */
            getAtlasUsedSize(): pdi.CommonSize;
            getAccessScore(): number;
    }
}

declare module 'g/lib/VideoSystem' {
    import type { VideoSystem as PdiVideoSystem } from "@akashic/pdi-types";
    /**
      * 将来 VideoPlayerインスタンスの一元管理（ボリューム設定などAudioSystemと似た役割）
      * を担うインターフェース。VideoAssetはVideoSystemを持つという体裁を整えるために(中身が空であるが)
      * 定義されている。
      * TODO: 実装
      */
    export class VideoSystem implements PdiVideoSystem {
    }
}

declare module 'g/lib/entities/CacheableE' {
    import type { CommonSize, Renderer, Surface } from "@akashic/pdi-types";
    import type { Camera } from "g/lib/Camera";
    import type { EParameterObject } from "g/lib/entities/E";
    import { E } from "g/lib/entities/E";
    /**
        * `CacheableE` のコンストラクタに渡すことができるパラメータ。
        */
    export interface CacheableEParameterObject extends EParameterObject {
    }
    /**
        * 内部描画キャッシュを持つ `E` 。
        */
    export abstract class CacheableE extends E {
            /**
                * _cache のパディングサイズ。
                *
                * @private
                */
            static PADDING: number;
            /**
                * エンジンが子孫を描画すべきであれば`true`、でなければ`false`を本クラスを継承したクラスがセットする。
                * デフォルト値は`true`となる。
                * @private
                */
            _shouldRenderChildren: boolean;
            /**
                * このエンティティの内部キャッシュ。
                * @private
                */
            _cache: Surface | undefined;
            /**
                * @private
                */
            _renderer: Renderer | undefined;
            /**
                * このエンティティを最後に描画した時の`Camrera`。
                *
                * @private
                */
            _renderedCamera: Camera | undefined;
            /**
                * 描画されるキャッシュサイズ。
                * このサイズは _cache のサイズよりも小さくなる場合がある。
                *
                * @private
                */
            _cacheSize: CommonSize;
            /**
                * 各種パラメータを指定して `CacheableE` のインスタンスを生成する。
                * @param param このエンティティに対するパラメータ
                */
            constructor(param: CacheableEParameterObject);
            /**
                * このエンティティの描画キャッシュ無効化をエンジンに通知する。
                * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
                */
            invalidate(): void;
            /**
                * このエンティティ自身の描画を行う。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                */
            renderSelf(renderer: Renderer, camera?: Camera): boolean;
            /**
                * 内部キャッシュから自身の描画を行う。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                */
            renderSelfFromCache(renderer: Renderer): void;
            /**
                * キャッシュの描画が必要な場合にこのメソッドが呼ばれる。
                * 本クラスを継承したエンティティはこのメソッド内で`renderer`に対してキャッシュの内容を描画しなければならない。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                */
            abstract renderCache(renderer: Renderer, camera?: Camera): void;
            /**
                * 利用している `Surface` を破棄した上で、このエンティティを破棄する。
                */
            destroy(): void;
            /**
                * キャッシュのサイズを取得する。
                * 本クラスを継承したクラスでエンティティのサイズと異なるサイズを利用する場合、このメソッドをオーバーライドする。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                * このメソッドから得られる値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            calculateCacheSize(): CommonSize;
    }
}

declare module 'g/lib/entities/FilledRect' {
    import type { Renderer } from "@akashic/pdi-types";
    import type { EParameterObject } from "g/lib/entities/E";
    import { E } from "g/lib/entities/E";
    /**
        * `FilledRect` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `FilledRect` の同名メンバの説明を参照すること。
        */
    export interface FilledRectParameterObject extends EParameterObject {
            /**
                * 矩形を塗りつぶす色。
                */
            cssColor: string;
            /**
                * このオブジェクトの横幅。
                */
            width: number;
            /**
                * このオブジェクトの縦幅。
                */
            height: number;
    }
    /**
        * 塗りつぶされた矩形を表すエンティティ。
        */
    export class FilledRect extends E {
            /**
                * 矩形を塗りつぶす色。
                * この値を変更した場合、 `this.modified()` を呼び出す必要がある。
                */
            cssColor: string;
            /**
                * 各種パラメータを指定して `FilledRect` のインスタンスを生成する。
                * @param param このエンティティに対するパラメータ
                */
            constructor(param: FilledRectParameterObject);
            /**
                * このエンティティ自身の描画を行う。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                */
            renderSelf(renderer: Renderer): boolean;
    }
}

declare module 'g/lib/entities/FrameSprite' {
    import type { ImageAsset, Surface } from "@akashic/pdi-types";
    import { Trigger } from "@akashic/trigger";
    import type { Timer } from "g/lib/Timer";
    import type { SpriteParameterObject } from "g/lib/entities/Sprite";
    import { Sprite } from "g/lib/entities/Sprite";
    /**
        * `FrameSprite` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `FrameSprite` の同名メンバの説明を参照すること。
        */
    export interface FrameSpriteParameterObject extends SpriteParameterObject {
            /**
                * 画像として使う `Surface` または `ImageAsset` 。
                */
            src: Surface | ImageAsset;
            /**
                * このエンティティの幅
                */
            width: number;
            /**
                * このエンティティの高さ
                */
            height: number;
            /**
                * 最初に表示される画像片のインデックス。
                * `start()` 呼び出しによりタイマーで自動的に書き換えられていくが、ゲーム開発者が明示的に値を設定してもよい。
                * @default 0
                */
            frameNumber?: number;
            /**
                * アニメーションの内容。
                *
                * アニメーションの各フレームでの表示内容を指定するインデックスの配列を指定する。
                * インデックスは、コンストラクタに渡された画像を幅 `srcWidth`, 高さ `srcHeight` 単位の小さな画像(画像片)の集まりであるとみなして、
                * 各画像片を特定する値である。左上の画像片を 0, その右隣の画像片を 1 として左上から右下に順に割り振られる。
                * @default [0]
                */
            frames?: number[];
            /**
                * アニメーションの更新頻度(ミリ秒)。
                * 省略された場合、 `start()` 時にFPSの逆数に設定される。(つまり、1フレームごとに画像が切り替わっていく)
                * @default (1000 / game.fps)
                */
            interval?: number;
            /**
                * アニメーションをループ再生させるか否か。
                * @default true
                */
            loop?: boolean;
    }
    /**
        * フレームとタイマーによるアニメーション機構を持つ `Sprite` 。
        *
        * このクラスは、コンストラクタで渡された画像を、
        * 幅 `srcWidth`, 高さ `srcHeight` 単位で区切られた小さな画像(以下、画像片)の集まりであると解釈する。
        * 各画像片は、左上から順に 0 から始まるインデックスで参照される。
        *
        * ゲーム開発者は、このインデックスからなる配列を `FrameSprite#frames` に設定する。
        * `FrameSprite` は、 `frames` に指定されたインデックス(が表す画像片)を順番に描画することでアニメーションを実現する。
        * アニメーションは `interval` ミリ秒ごとに進み、 `frames` の内容をループする。
        *
        * このクラスにおける `srcWidth`, `srcHeight` の扱いは、親クラスである `Sprite` とは異なっていることに注意。
        */
    export class FrameSprite extends Sprite {
            /**
                * 現在表示されている画像片のインデックス。
                *
                * `start()` 呼び出しによりタイマーで自動的に書き換えられていくが、ゲーム開発者が明示的に値を設定してもよい。
                * 初期値は `0` である。
                * この値を変更した場合、 `this.modified()` を呼び出す必要がある。
                */
            frameNumber: number;
            /**
                * アニメーションの内容。
                *
                * アニメーションの各フレームでの表示内容を指定するインデックスの配列を指定する。初期値は `[0]` である。
                * インデックスは、コンストラクタに渡された画像を幅 `srcWidth`, 高さ `srcHeight` 単位の小さな画像(画像片)の集まりであるとみなして、
                * 各画像片を特定する値である。左上の画像片を 0, その右隣の画像片を 1 として左上から右下に順に割り振られる。
                *
                * この値を変更した場合、 `this.modified()` を呼び出す必要がある。
                */
            frames: number[];
            /**
                * アニメーションの更新頻度(ミリ秒)。
                * 指定しなかった場合、 `start()` 時にFPSの逆数に設定される。(つまり、1フレームごとに画像が切り替わっていく)
                * この値を変更した場合、反映には `this.start()` を呼び出す必要がある。
                */
            interval: number | undefined;
            /**
                * アニメーションをループ再生させるか否か。
                * 初期値は `true` である。
                */
            loop: boolean;
            /**
                * アニメーション終了時にfireされるTrigger。
                * 本Triggerは loop: false の場合にのみfireされる。
                */
            onFinish: Trigger<void>;
            /**
                * アニメーション終了時にfireされるTrigger。
                * 本Triggerは loop: false の場合にのみfireされる。
                * @deprecated 非推奨である。将来的に削除される。代わりに `onFinish` を利用すること。
                */
            finished: Trigger<void>;
            /**
                * @private
                */
            _timer: Timer | undefined;
            /**
                * @private
                */
            _lastUsedIndex: number;
            /**
                * `Sprite` から `FrameSprite` を作成する。
                * @param sprite 画像として使う`Sprite`
                * @param width 作成されるエンティティの高さ。省略された場合、 `sprite.width`
                * @param height 作成されるエンティティの高さ。省略された場合、 `sprite.height`
                */
            static createBySprite(sprite: Sprite, width?: number, height?: number): FrameSprite;
            /**
                * 各種パラメータを指定して `FrameSprite` のインスタンスを生成する。
                * @param param `FrameSprite` に設定するパラメータ
                */
            constructor(param: FrameSpriteParameterObject);
            /**
                * アニメーションを開始する。
                */
            start(): void;
            /**
                * このエンティティを破棄する。
                * デフォルトでは利用している `Surface` の破棄は行わない点に注意。
                * @param destroySurface trueを指定した場合、このエンティティが抱える `Surface` も合わせて破棄する
                */
            destroy(destroySurface?: boolean): void;
            /**
                * アニメーションを停止する。
                */
            stop(): void;
            /**
                * このエンティティに対する変更をエンジンに通知する。詳細は `E#modified()` のドキュメントを参照。
                */
            modified(isBubbling?: boolean): void;
            /**
                * @private
                */
            _handleElapse(): void;
            /**
                * @private
                */
            _free(): void;
            /**
                * @private
                */
            _changeFrame(): void;
    }
}

declare module 'g/lib/entities/Label' {
    import type { Glyph, Renderer } from "@akashic/pdi-types";
    import type { Font } from "g/lib/Font";
    import { TextAlign } from "g/lib/TextAlign";
    import type { TextAlignString } from "g/lib/TextAlignString";
    import type { CacheableEParameterObject } from "g/lib/entities/CacheableE";
    import { CacheableE } from "g/lib/entities/CacheableE";
    /**
        * `Label` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `Label` の同名メンバの説明を参照すること。
        */
    export interface LabelParameterObject extends CacheableEParameterObject {
            /**
                * 描画する文字列。
                */
            text: string;
            /**
                * 描画に利用されるフォント。
                */
            font: Font;
            /**
                * フォントサイズ。
                * 0 以上の数値でなければならない。そうでない場合、動作は不定である。
                *
                * これは `LabelParameterObject#font` で
                * 与えられたフォントを `fontSize` フォントサイズ相当で描画するよう指示する値である。
                * 歴史的経緯によりフォントサイズと説明されているが、実際には拡大縮小率を求めるため
                * に用いられている。
                * @default LabelParameterObject#font.size
                */
            fontSize?: number;
            /**
                * 文字列の描画位置。
                * `"left"` (または非推奨の旧称 `g.TextAlign.Left`) 以外にする場合、
                * `widthAutoAdjust` を `false` にすべきである。(`widthAutoAdjust` の項を参照)
                * @default TextAlign.Left
                */
            textAlign?: TextAlign | TextAlignString;
            /**
                * このラベルの最大幅。
                * @default undefined
                */
            maxWidth?: number;
            /**
                * `width` プロパティを `this.text` の描画に必要な幅で自動的に更新するかを表す。
                * `textAlign` を `"left"` (または非推奨の旧称 `g.TextAlign.Left`) 以外にする場合、この値は `false` にすべきである。
                * (`textAlign` は `width` を元に描画位置を調整するため、 `true` の場合左寄せで右寄せでも描画結果が変わらなくなる)
                * @default true
                */
            widthAutoAdjust?: boolean;
            /**
                * 文字列の描画色をCSS Color形式で指定する。
                * 元の描画色に重ねて表示されるため、アルファ値を指定した場合は元の描画色が透けて表示される。
                * 省略された場合、この場合描画色の変更を行わない。
                * @default undefined
                */
            textColor?: string;
    }
    /**
        * 単一行のテキストを描画するエンティティ。
        * 本クラスの利用には `BitmapFont` または `DynamicFont` が必要となる。
        */
    export class Label extends CacheableE {
            /**
                * 描画する文字列。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            text: string;
            /**
                * 描画に利用されるフォント。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            font: Font;
            /**
                * 文字列の描画位置。
                * `"left"` (または非推奨の旧称 `TextAlign.Left`) 以外にする場合、
                * `widthAutoAdjust` を `false` にすべきである。(`widthAutoAdjust` の項を参照)
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                *
                * @default `TextAlign.Left`
                */
            textAlign: TextAlign | TextAlignString;
            /**
                * キャッシュされたグリフ情報。
                * 通常、ゲーム開発者がこのプロパティを参照する必要はない。
                */
            glyphs: Glyph[];
            /**
                * フォントサイズ。
                * 0 以上の数値でなければならない。そうでない場合、動作は不定である。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                *
                * @default Label#font.size
                */
            fontSize: number;
            /**
                * このラベルの最大幅。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            maxWidth: number | undefined;
            /**
                * `width` プロパティを `this.text` の描画に必要な幅で自動的に更新するかを表す。
                * 初期値は `true` である。
                * `textAlign` を `"left"` (または非推奨の旧称 `g.TextAlign.Left`) 以外にする場合、この値は `false` にすべきである。
                * (`textAlign` は `width` を元に描画位置を調整するため、 `true` の場合左寄せで右寄せでも描画結果が変わらなくなる)
                *
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            widthAutoAdjust: boolean;
            /**
                * 文字列の描画色をCSS Color形式で指定する。
                * 元の描画色に重ねて表示されるため、アルファ値を指定した場合は元の描画色が透けて表示される。
                * 初期値は `undefined` となり、 描画色の変更を行わない。
                */
            textColor: string | undefined;
            /**
                * @private
                */
            _realTextAlign: TextAlignString;
            /**
                * @private
                */
            _textWidth: number;
            /**
                * @private
                * 最初の文字が描画の基準点から左にはみだす量。
                */
            _overhangLeft: number;
            /**
                * @private
                * 最後の文字が glyph.advanceWidth から右にはみだす量。
                */
            _overhangRight: number;
            /**
                * 各種パラメータを指定して `Label` のインスタンスを生成する。
                * @param param このエンティティに指定するパラメータ
                */
            constructor(param: LabelParameterObject);
            /**
                * `width` と `textAlign` を設定し、 `widthAutoAdjust` を `false` に設定する。
                *
                * このメソッドは `this.textAlign` を設定するためのユーティリティである。
                * `textAlign` を `"left"` (または非推奨の旧称 `TextAlign.Left`) 以外に設定する場合には、
                * 通常 `width` や `widthAutoAdjust` も設定する必要があるため、それらをまとめて行う。
                * このメソッドの呼び出し後、 `this.invalidate()` を呼び出す必要がある。
                * @param width 幅
                * @param textAlign テキストの描画位置
                */
            aligning(width: number, textAlign: TextAlign | TextAlignString): void;
            /**
                * このエンティティの描画キャッシュ無効化をエンジンに通知する。
                * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
                */
            invalidate(): void;
            /**
                * Label自身の描画を行う。
                */
            renderSelfFromCache(renderer: Renderer): void;
            renderCache(renderer: Renderer): void;
            /**
                * このエンティティを破棄する。
                * 利用している `BitmapFont` の破棄は行わないため、 `BitmapFont` の破棄はコンテンツ製作者が明示的に行う必要がある。
                */
            destroy(): void;
    }
}

declare module 'g/lib/entities/Pane' {
    import type { CommonArea, CommonOffset, CommonRect, ImageAsset, Renderer, Surface } from "@akashic/pdi-types";
    import type { Camera } from "g/lib/Camera";
    import type { Matrix } from "g/lib/Matrix";
    import type { SurfaceEffector } from "g/lib/SurfaceEffector";
    import type { CacheableEParameterObject } from "g/lib/entities/CacheableE";
    import { CacheableE } from "g/lib/entities/CacheableE";
    /**
        * `Pane` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `Pane` の同名メンバの説明を参照すること。
        */
    export interface PaneParameterObject extends CacheableEParameterObject {
            /**
                * このオブジェクトの横幅。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                */
            width: number;
            /**
                * このオブジェクトの縦幅。実際の表示領域としてはscaleX, scaleY, angleの値も考慮する必要がある。
                */
            height: number;
            /**
                * 背景画像として使う `ImageAsset` または `Surface` 。
                * 省略された場合、背景には何も描かれない。
                * @default undefined
                */
            backgroundImage?: ImageAsset | Surface;
            /**
                * 子孫エンティティの描画位置・クリッピングサイズを決めるパディング。
                * @default 0
                */
            padding?: CommonRect | number;
            /**
                * 背景画像の描画方法を指定する `SurfaceEffector` 。
                * `undefined` の場合、描画方法をカスタマイズしない。
                * @deprecated 非推奨である。将来的に削除される予定である。
                * @default undefined
                */
            backgroundEffector?: SurfaceEffector;
    }
    /**
        * 枠を表すエンティティ。
        * クリッピングやパディング、バックグラウンドイメージの演出等の機能を持つため、
        * メニューやメッセージ、ステータスのウィンドウ等に利用されることが期待される。
        * このエンティティの子要素は、このエンティティの持つ `Surface` に描画される。
        */
    export class Pane extends CacheableE {
            /**
                * 背景画像の `ImageAsset` または `Surface` 。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            backgroundImage: ImageAsset | Surface | undefined;
            /**
                * 背景画像の拡大・縮小に用いられる `SurfaceEffector` 。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                * @deprecated 非推奨である。将来的に削除される予定である。
                */
            backgroundEffector: SurfaceEffector | undefined;
            /**
                * @private
                */
            _backgroundImageSurface: Surface | undefined;
            /**
                * @private
                */
            _beforeBackgroundImage: ImageAsset | Surface | undefined;
            /**
                * @private
                */
            _padding: CommonRect | number;
            /**
                * @private
                */
            _paddingChanged: boolean;
            /**
                * @private
                */
            _normalizedPadding: CommonRect;
            /**
                * @private
                */
            _bgSurface: Surface | undefined;
            /**
                * @private
                */
            _oldWidth: number;
            /**
                * @private
                */
            _oldHeight: number;
            /**
                * @private
                */
            _childrenArea: CommonArea;
            /**
                * @private
                */
            _childrenSurface: Surface;
            /**
                * @private
                */
            _childrenRenderer: Renderer;
            /**
                * 各種パラメータを指定して `Pane` のインスタンスを生成する。
                * @param param このエンティティに指定するパラメータ
                */
            constructor(param: PaneParameterObject);
            /**
                * パディング。
                * このエンティティの子孫は、パディングに指定された分だけ右・下にずれた場所に描画され、またパディングの矩形サイズでクリッピングされる。
                */
            set padding(padding: CommonRect | number);
            get padding(): CommonRect | number;
            /**
                * このエンティティに対する変更をエンジンに通知する。
                * このメソッドの呼び出し後、 `this` に対する変更が各 `Renderer` の描画に反映される。
                * このメソッドは描画キャッシュの無効化を保証しない。描画キャッシュの無効化も必要な場合、 `invalidate()`を呼び出さなければならない。
                * 詳細は `E#modified()` のドキュメントを参照。
                */
            modified(isBubbling?: boolean): void;
            shouldFindChildrenByPoint(point: CommonOffset): boolean;
            renderCache(renderer: Renderer, camera?: Camera): void;
            /**
                * このエンティティを破棄する。また、バックバッファで利用している `Surface` も合わせて破棄される。
                * ただし、 `backgroundImage` に利用している `Surface` の破棄は行わない。
                * @param destroySurface trueを指定した場合、 `backgroundImage` に利用している `Surface` も合わせて破棄する。
                */
            destroy(destroySurface?: boolean): void;
            /**
                * @private
                */
            _renderBackground(): void;
            /**
                * @private
                */
            _renderChildren(camera?: Camera): void;
            /**
                * @private
                */
            _initialize(): void;
            /**
                * このPaneの包含矩形を計算する。
                * Eを継承する他のクラスと異なり、Paneは子要素の位置を包括矩形に含まない。
                * @private
                */
            _calculateBoundingRect(m?: Matrix): CommonRect | undefined;
    }
}

declare module 'g/lib/entities/Sprite' {
    import type { ImageAsset, Renderer, Surface } from "@akashic/pdi-types";
    import type { Camera } from "g/lib/Camera";
    import type { Matrix } from "g/lib/Matrix";
    import type { EParameterObject } from "g/lib/entities/E";
    import { E } from "g/lib/entities/E";
    /**
        * `Sprite` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `Sprite` の同名メンバの説明を参照すること。
        *
        * 値に `width` または `height` が含まれていない場合、
        * `Sprite` のコンストラクタはそれぞれ `src.width`、 `src.height` が指定されたかのように振る舞う。
        */
    export interface SpriteParameterObject extends EParameterObject {
            /**
                * 画像として使う `Surface` または `ImageAsset` 。
                */
            src: Surface | ImageAsset;
            /**
                * `surface` の描画対象部分の幅。
                * 描画はこの値を `this.width` に拡大または縮小する形で行われる。
                * 省略された場合、値に `width` があれば `width` 、なければ `src.width` 。
                * @default width || src.width
                */
            srcWidth?: number;
            /**
                * `surface` の描画対象部分の高さ。
                * 描画はこの値を `this.height` に拡大または縮小する形で行われる。
                * 省略された場合、値に `height` があれば `height` 、なければ `src.height` 。
                * @default height || src.height
                */
            srcHeight?: number;
            /**
                * `surface` の描画対象部分の左端。
                * @default 0
                */
            srcX?: number;
            /**
                * `surface` の描画対象部分の上端。
                * @default 0
                */
            srcY?: number;
    }
    /**
        * 画像を描画するエンティティ。
        */
    export class Sprite extends E {
            /**
                * 描画する `Surface` または `ImageAsset` 。
                * `srcX` ・ `srcY` ・ `srcWidth` ・ `srcHeight` の作る矩形がこの画像の範囲外を示す場合、描画結果は保証されない。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            src: Surface | ImageAsset;
            /**
                * `surface` の描画対象部分の幅。
                * 描画はこの値を `this.width` に拡大または縮小する形で行われる。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            srcWidth: number;
            /**
                * `surface` の描画対象部分の高さ。
                * 描画はこの値を `this.height` に拡大または縮小する形で行われる。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            srcHeight: number;
            /**
                * `surface` の描画対象部分の左端。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            srcX: number;
            /**
                * `surface` の描画対象部分の上端。
                * この値を変更した場合、 `this.invalidate()` を呼び出す必要がある。
                */
            srcY: number;
            /**
                * @private
                */
            _surface: Surface;
            /**
                * @private
                */
            _stretchMatrix: Matrix | undefined;
            /**
                * @private
                */
            _beforeSrc: Surface | ImageAsset | undefined;
            /**
                * @private
                */
            _beforeSurface: Surface | undefined;
            /**
                * 各種パラメータを指定して `Sprite` のインスタンスを生成する。
                * @param param `Sprite` に設定するパラメータ
                */
            constructor(param: SpriteParameterObject);
            /**
                * @private
                */
            _handleUpdate(): void;
            /**
                * @private
                */
            _handleAnimationStart(): void;
            /**
                * @private
                */
            _handleAnimationStop(): void;
            /**
                * このエンティティ自身の描画を行う。
                * このメソッドはエンジンから暗黙に呼び出され、ゲーム開発者が呼び出す必要はない。
                */
            renderSelf(renderer: Renderer, _camera?: Camera): boolean;
            /**
                * このエンティティの描画キャッシュ無効化をエンジンに通知する。
                * このメソッドを呼び出し後、描画キャッシュの再構築が行われ、各 `Renderer` に描画内容の変更が反映される。
                */
            invalidate(): void;
            /**
                * このエンティティを破棄する。
                * デフォルトでは利用している `Surface` の破棄は行わない点に注意。
                * @param destroySurface trueを指定した場合、このエンティティが抱える `Surface` も合わせて破棄する
                */
            destroy(destroySurface?: boolean): void;
    }
}

declare module 'g/lib/AudioUtil' {
    import type { AudioPlayContext } from "g/lib/AudioPlayContext";
    import type { Game } from "g/lib/Game";
    /**
        * イージング関数。
        *
        * @param t 経過時間
        * @param b 開始位置
        * @param c 差分
        * @param d 所要時間
        */
    export type EasingFunction = (t: number, b: number, c: number, d: number) => number;
    export type AudioTransitionContext = {
            /**
                * 遷移を即座に完了する。
                * 音量は遷移完了後の値となる。
                */
            complete: () => void;
            /**
                * 遷移を取り消す。音量はこの関数を実行した時点での値となる。
                * @param revert 音量を遷移実行前まで戻すかどうか。省略時は `false` 。
                */
            cancel: (revert?: boolean) => void;
    };
    /**
        * Audio に関連するユーティリティ。
        */
    export namespace AudioUtil {
            /**
                * 音声をフェードインさせる。
                *
                * @param game 対象の `Game`。
                * @param context 対象の `AudioPlayContext` 。
                * @param duration フェードインの長さ (ms)。
                * @param to フェードイン後の音量。0 未満または 1 より大きい値を指定した場合の挙動は不定である。省略時は `1` 。
                * @param easing イージング関数。省略時は linear 。
                */
            function fadeIn(game: Game, context: AudioPlayContext, duration: number, to?: number, easing?: EasingFunction): AudioTransitionContext;
            /**
                * 音声をフェードアウトさせる。
                *
                * @param game 対象の `Game`。
                * @param context 対象の `AudioPlayContext` 。
                * @param duration フェードアウトの長さ (ms)。
                * @param easing イージング関数。省略時は linear が指定される。
                */
            function fadeOut(game: Game, context: AudioPlayContext, duration: number, easing?: EasingFunction): AudioTransitionContext;
            /**
                * 二つの音声をクロスフェードさせる。
                *
                * @param game 対象の `Game`。
                * @param fadeInContext フェードイン対象の `AudioPlayContext` 。
                * @param fadeOutContext フェードアウト対象の `AudioPlayContext` 。
                * @param duration クロスフェードの長さ (ms)。
                * @param to クロスフェード後の音量。0 未満または 1 より大きい値を指定した場合の挙動は不定。省略時は `1` 。
                * @param easing イージング関数。フェードインとフェードアウトで共通であることに注意。省略時は linear が指定される。
                */
            function crossFade(game: Game, fadeInContext: AudioPlayContext, fadeOutContext: AudioPlayContext, duration: number, to?: number, easing?: EasingFunction): AudioTransitionContext;
            /**
                * 音量を指定のイージングで遷移させる。
                *
                * @param game 対象の `Game`。
                * @param context 対象の `AudioPlayContext` 。
                * @param duration 遷移の長さ (ms)。
                * @param to 遷移後の音量。0 未満または 1 より大きい値を指定した場合の挙動は不定。
                * @param easing イージング関数。省略時は linear が指定される。
                */
            function transitionVolume(game: Game, context: AudioPlayContext, duration: number, to: number, easing?: EasingFunction): AudioTransitionContext;
    }
}

declare module 'g/lib/BitmapFont' {
    import type { GlyphArea, Glyph, ImageAsset, Surface } from "@akashic/pdi-types";
    import { Font } from "g/lib/Font";
    /**
        * BitmapFont の初期化に必要なパラメータのセット
        */
    export interface BitmapFontGlyphInfo {
            map: {
                    [key: string]: GlyphArea;
            };
            width: number;
            height: number;
            missingGlyph: GlyphArea;
    }
    /**
        * `BitmapFont` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `BitmapFont` の同名メンバの説明を参照すること。
        */
    export interface BitmapFontParameterObject {
            /**
                * 文字データとして利用する画像を表す `Surface` または `ImageAsset`。文字を敷き詰めたもの。
                */
            src: Surface | ImageAsset;
            /**
                * BitmapFont の生成に必要なデータセット。
                * glyphInfo が与えられる場合、 BitmapFontParameterObject の map, defaultGlyphWidth, defaultGlyphHeight, missingGlyph は参照されない。
                */
            glyphInfo?: BitmapFontGlyphInfo;
            /**
                * 各文字から画像上の位置・サイズなどを特定する情報。コードポイントから `GlyphArea` への写像。
                */
            map?: {
                    [key: string]: GlyphArea;
            };
            /**
                * `map` で指定を省略した文字に使われる、デフォルトの文字の幅。
                * この値を省略した場合、 map の持つ全ての GlyphArea は width を持たなければならない。そうでない場合の動作は不定である。
                */
            defaultGlyphWidth?: number;
            /**
                * `map` で指定を省略した文字に使われる、デフォルトの文字の高さ
                * この値を省略した場合、 map の持つ全ての GlyphArea は height を持たなければならない。そうでない場合の動作は不定である。
                */
            defaultGlyphHeight?: number;
            /**
                * `map` に存在しないコードポイントの代わりに表示するべき文字の `GlyphArea` 。
                * @default undefined
                */
            missingGlyph?: GlyphArea;
    }
    /**
        * ラスタ画像によるフォント。
        */
    export class BitmapFont extends Font {
            surface: Surface;
            defaultGlyphWidth: number;
            defaultGlyphHeight: number;
            map: {
                    [key: string]: GlyphArea;
            };
            missingGlyph: GlyphArea | undefined;
            /**
                * 各種パラメータを指定して `BitmapFont` のインスタンスを生成する。
                * @param param `BitmapFont` に設定するパラメータ
                */
            constructor(param: BitmapFontParameterObject);
            /**
                * コードポイントに対応するグリフを返す。
                * @param code コードポイント
                */
            glyphForCharacter(code: number): Glyph | null;
            /**
                * 利用している `Surface` を破棄した上で、このフォントを破棄する。
                */
            destroy(): void;
            /**
                * 破棄されたオブジェクトかどうかを判定する。
                */
            destroyed(): boolean;
    }
}

declare module 'g/lib/Camera2D' {
    import type { Renderer } from "@akashic/pdi-types";
    import type { Camera } from "g/lib/Camera";
    import type { Object2DParameterObject } from "g/lib/Object2D";
    import { Object2D } from "g/lib/Object2D";
    export interface Camera2DSerialization {
            param: Camera2DParameterObject;
    }
    /**
        * `Camera2D` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `Camera2D` の同名メンバの説明を参照すること。
        */
    export interface Camera2DParameterObject extends Object2DParameterObject {
            /**
                * このカメラがローカルであるか否か。
                * @default false
                */
            local?: boolean;
            /**
                * このカメラの名前。
                * @default undefined
                */
            name?: string;
    }
    /**
        * 2D世界におけるカメラ。
        */
    export class Camera2D extends Object2D implements Camera {
            /**
                * このカメラがローカルであるか否か。
                *
                * 初期値は偽である。
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を直接変更してはならない。
                */
            local: boolean;
            /**
                * このカメラの名前。
                * 初期値は `undefined` である。
                */
            name: string | undefined;
            /**
                * @private
                */
            _modifiedCount: number;
            /**
                * 与えられたシリアリゼーションでカメラを復元する。
                *
                * @param ser `Camera2D#serialize()` の戻り値
                */
            static deserialize(ser: any): Camera2D;
            /**
                * 指定されたパラメータで `Camera2D` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: Camera2DParameterObject);
            /**
                * カメラ状態の変更をエンジンに通知する。
                *
                * このメソッドの呼び出し後、このカメラのプロパティに対する変更が各 `Renderer` の描画に反映される。
                * ただし逆は真ではない。すなわち、再描画は他の要因によって行われることもある。
                * ゲーム開発者は、このメソッドを呼び出していないことをもって再描画が行われていないことを仮定してはならない。
                *
                * 本メソッドは、このオブジェクトの `Object2D` 由来のプロパティ (`x`, `y`, `angle` など) を変更した場合にも呼びだす必要がある。
                */
            modified(): void;
            /**
                * このカメラをシリアライズする。
                *
                * このメソッドの戻り値を `Camera2D#deserialize()` に渡すことで同じ値を持つカメラを復元することができる。
                */
            serialize(): any;
            /**
                * @private
                */
            _applyTransformToRenderer(renderer: Renderer): void;
            /**
                * @private
                */
            _updateMatrix(): void;
    }
}

declare module 'g/lib/Collision' {
    import type { CommonArea, CommonOffset } from "@akashic/pdi-types";
    import type { E } from "g/lib/entities/E";
    /**
        * オブジェクトなどの衝突判定機能を提供する。
        */
    export namespace Collision {
            /**
                * 二つのエンティティの衝突判定を行い、その結果を返す。
                *
                * 回転・拡大されたエンティティや、親の異なるエンティティ同士も扱える汎用の衝突判定処理。
                * ただし計算量が多いので、大量のエンティティ間のすべての衝突を確認するような状況では利用を避けることが望ましい。
                * 親が同じで回転・拡大を行わないエンティティ同士の場合は、より軽量な Collision.intersectAreas() を利用すること。
                * 親が同じで中心座標同士の距離だけで判定してよい場合は、より軽量な Collision.withinAreas() を利用すること。
                *
                * 対象のエンティティの座標や大きさなどを変更した場合、
                * この関数の呼び出し前にそのエンティティの modified() を呼び出しておく必要がある。
                *
                * @param e1 衝突判定するエンティティ
                * @param e2 衝突判定するエンティティ
                * @param area1 e1 の当たり判定領域。省略された場合、`{ x: 0, y: 0, width: e1.width, hegiht: e1.height }`
                * @param area2 e2 の当たり判定領域。省略された場合、`{ x: 0, y: 0, width: e2.width, hegiht: e2.height }`
                */
            function intersectEntities(e1: E, e2: E, area1?: CommonArea | null, area2?: CommonArea | null): boolean;
            /**
                * 線分同士の衝突判定 (交差判定) を行い、その結果を返す。
                *
                * @param {CommonOffset} p1 線分の端点の一つ
                * @param {CommonOffset} p2 線分の端点の一つ
                * @param {CommonOffset} q1 もう一つの線分の端点の一つ
                * @param {CommonOffset} q2 もう一つの線分の端点の一つ
                */
            function intersectLineSegments(p1: CommonOffset, p2: CommonOffset, q1: CommonOffset, q2: CommonOffset): boolean;
            /**
                * 矩形交差による衝突判定を行い、その結果を返す。
                * 戻り値は、二つの矩形t1, t2が交差しているとき真、でなければ偽。
                *
                * @param {number} x1 t1のX座標
                * @param {number} y1 t1のY座標
                * @param {number} width1 t1の幅
                * @param {number} height1 t1の高さ
                * @param {number} x2 t2のX座標
                * @param {number} y2 t2のY座標
                * @param {number} width2 t2の幅
                * @param {number} height2 t2の高さ
                */
            function intersect(x1: number, y1: number, width1: number, height1: number, x2: number, y2: number, width2: number, height2: number): boolean;
            /**
                * 矩形交差による衝突判定を行い、その結果を返す。
                * 戻り値は、矩形t1, t2が交差しているとき真、でなければ偽。
                *
                * 特に、回転・拡大を利用していない、親が同じエンティティ同士の衝突判定に利用することができる。
                * 条件を満たさない場合は `withinAreas()` や、より重いが正確な `intersectEntities()` の利用を検討すること。
                *
                * @param {CommonArea} t1 矩形1
                * @param {CommonArea} t2 矩形2
                */
            function intersectAreas(t1: CommonArea, t2: CommonArea): boolean;
            /**
                * 2点間の距離による衝突判定を行い、その結果を返す。
                * 戻り値は、2点間の距離が閾値以内であるとき真、でなければ偽。
                * @param {number} t1x 一点の X 座標
                * @param {number} t1y 一点の Y 座標
                * @param {number} t2x もう一点の X 座標
                * @param {number} t2y もう一点の Y 座標
                * @param {number} [distance=1] 衝突判定閾値 [pixel]
                */
            function within(t1x: number, t1y: number, t2x: number, t2y: number, distance?: number): boolean;
            /**
                * 2つの矩形の中心座標間距離による衝突判定を行い、その結果を返す。
                * 戻り値は、2点間の距離が閾値以内であるとき真、でなければ偽。
                * @param {CommonArea} t1 矩形1
                * @param {CommonArea} t2 矩形2
                * @param {number} [distance=1] 衝突判定閾値 [pixel]
                */
            function withinAreas(t1: CommonArea, t2: CommonArea, distance?: number): boolean;
    }
}

declare module 'g/lib/DefaultLoadingScene' {
    import type { Asset } from "@akashic/pdi-types";
    import type { Game } from "g/lib/Game";
    import { LoadingScene } from "g/lib/LoadingScene";
    import type { Scene } from "g/lib/Scene";
    /**
        * `DefaultLoadingScene` のコンストラクタに渡すことができるパラメータ。
        * 汎用性のあるクラスではなく、カスタマイズすべき余地は大きくないので LoadingSceneParameterObject は継承していない。
        */
    export interface DefaultLoadingSceneParameterObject {
            /**
                * このシーンが属する `Game` 。
                */
            game: Game;
            style?: "default" | "compact";
    }
    /**
        * デフォルトローディングシーン。
        *
        * `Game#_defaultLoadingScene` の初期値として利用される。
        * このシーンはいかなるアセットも用いてはならない。
        */
    export class DefaultLoadingScene extends LoadingScene {
            /**
                * `DefaultLoadingScene` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: DefaultLoadingSceneParameterObject);
            /**
                * @private
                */
            _handleLoad(): boolean;
            /**
                * @private
                */
            _handleUpdate(): void;
            /**
                * @private
                */
            _handleTargetReset(targetScene: Scene): void;
            /**
                * @private
                */
            _handleTargetAssetLoad(_asset: Asset): void;
    }
}

declare module 'g/lib/DefaultSkippingScene' {
    import type { SceneParameterObject } from "g/lib/Scene";
    import { Scene } from "g/lib/Scene";
    /**
        * `DefaultSkippingScene` のコンストラクタに渡すことができるパラメータ。
        */
    export interface DefaultSkippingSceneParameterObject extends SceneParameterObject {
            style: "none" | "indicator";
    }
    /**
        * デフォルトスキッピングシーン。
        *
        * `Game#_defaultSkippingScene` の初期値として利用される。
        */
    export class DefaultSkippingScene extends Scene {
            /**
                * `DefaultSkippingScene` のインスタンスを生成する。
                * @param param 初期化に用いるパラメータのオブジェクト
                */
            constructor(param: DefaultSkippingSceneParameterObject);
    }
}

declare module 'g/lib/DynamicFont' {
    import type { FontWeightString, GlyphFactory, ResourceFactory } from "@akashic/pdi-types";
    import { FontFamily, FontWeight } from "@akashic/pdi-types";
    import { BitmapFont } from "g/lib/BitmapFont";
    import { Font } from "g/lib/Font";
    import type { Game } from "g/lib/Game";
    import type { Glyph } from "g/lib/Glyph";
    import type { SurfaceAtlasSetHint } from "g/lib/SurfaceAtlasSet";
    import { SurfaceAtlasSet } from "g/lib/SurfaceAtlasSet";
    /**
        * `DynamicFont` のコンストラクタに渡すことができるパラメータ。
        * 各メンバの詳細は `DynamicFont` の同名メンバの説明を参照すること。
        * パラメータのsurfaceAtlasSetが存在する場合は、パラメータのsurfaceAtlasSetを使用する。
        * surfaceAtlasSetが存在せず、DynamicFontHintが存在する場合、DynamicFontが管理するSurfaceAtlasSetを使用する。
        * surfaceAtlasSetが存在せず、DynamicFontHintが存在しない場合、gameが持つ共通のSurfaceAtlasSetを使用する。
        */
    export interface DynamicFontParameterObject {
            /**
                * ゲームインスタンス。
                */
            game: Game;
            /**
                * フォントファミリ。
                *
                * フォント名、またはそれらの配列で指定する。
                * フォント名として指定できる値は環境に依存する。
                * 少なくとも `"sans-serif"`, `"serif"`, `"monospace"` (それぞれサンセリフ体、セリフ体、等幅の字体) は有効な値である。
                * `g.FontFamily` を指定することは非推奨である。代わりに上記文字列を利用すること。
                *
                * この値は参考値である。環境によっては無視される可能性がある。
                */
            fontFamily: FontFamily | string | (FontFamily | string)[];
            /**
                * フォントサイズ。
                */
            size: number;
            /**
                * ヒント。
                *
                * 詳細は `DynamicFontHint` を参照。
                */
            hint?: DynamicFontHint;
            /**
                * フォント色。CSS Colorで指定する。
                * @default "black"
                */
            fontColor?: string;
            /**
                * フォントウェイト。
                * `g.FontWeight` を指定することは非推奨である。代わりに `g.FontWeightString` を利用すること。
                * @default g.FontWeight.Normal
                */
            fontWeight?: FontWeight | FontWeightString;
            /**
                * 輪郭幅。
                * @default 0
                */
            strokeWidth?: number;
            /**
                * 輪郭色。
                * @default 0
                */
            strokeColor?: string;
            /**
                * 文字の輪郭のみを描画するか否か。
                * @default false
                */
            strokeOnly?: boolean;
            /**
                * サーフェスアトラスセット
                * @default undefined
                */
            surfaceAtlasSet?: SurfaceAtlasSet;
    }
    /**
        * DynamicFontが効率よく動作するためのヒント。
        *
        * ゲーム開発者はDynamicFontが効率よく動作するための各種初期値・最大値などを
        * 提示できる。DynamicFontはこれを参考にするが、そのまま採用するとは限らない。
        */
    export interface DynamicFontHint extends SurfaceAtlasSetHint {
            /**
                * あらかじめグリフを生成する文字のセット。
                */
            presetChars?: string;
            /**
                * ベースライン。
                */
            baselineHeight?: number;
    }
    /**
        * ビットマップフォントを逐次生成するフォント。
        */
    export class DynamicFont extends Font {
            /**
                * フォントファミリ。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            fontFamily: FontFamily | string | (FontFamily | string)[];
            /**
                * フォントサイズ。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            size: number;
            /**
                * ヒント。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            hint: DynamicFontHint;
            /**
                * フォント色。CSS Colorで指定する。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                * @default "black"
                */
            fontColor: string;
            /**
                * フォントウェイト。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                * @default g.FontWeight.Normal
                */
            fontWeight: FontWeight | FontWeightString;
            /**
                * 輪郭幅。
                * 0 以上の数値でなければならない。 0 を指定した場合、輪郭は描画されない。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                * @default 0
                */
            strokeWidth: number;
            /**
                * 輪郭色。CSS Colorで指定する。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                * @default "black"
                */
            strokeColor: string;
            /**
                * 文字の輪郭のみを描画するか切り替える。
                * `true` を指定した場合、輪郭のみ描画される。
                * `false` を指定した場合、文字と輪郭が描画される。
                *
                * このプロパティは参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                * @default false
                */
            strokeOnly: boolean;
            /**
                * @private
                */
            _resourceFactory: ResourceFactory;
            /**
                * @private
                */
            _glyphs: {
                    [key: number]: Glyph;
            };
            /**
                * @private
                */
            _glyphFactory: GlyphFactory;
            /**
                * @private
                */
            _destroyed: boolean;
            /**
                * @private
                */
            _isSurfaceAtlasSetOwner: boolean;
            /**
                * @private
                */
            _atlasSet: SurfaceAtlasSet;
            /**
                * 各種パラメータを指定して `DynamicFont` のインスタンスを生成する。
                * @param param `DynamicFont` に設定するパラメータ
                */
            constructor(param: DynamicFontParameterObject);
            /**
                * グリフの取得。
                *
                * 取得に失敗するとnullが返る。
                *
                * 取得に失敗した時、次のようにすることで成功するかもしれない。
                * - DynamicFont生成時に指定する文字サイズを小さくする
                * - アトラスの初期サイズ・最大サイズを大きくする
                *
                * @param code 文字コード
                */
            glyphForCharacter(code: number): Glyph | null;
            /**
                * BtimapFontの生成。
                *
                * 実装上の制限から、このメソッドを呼び出す場合、maxAtlasNum が 1 または undefined/null(1として扱われる) である必要がある。
                * そうでない場合、失敗する可能性がある。
                *
                * @param missingGlyphChar `BitmapFont#map` に存在しないコードポイントの代わりに表示するべき文字。最初の一文字が用いられる。
                */
            asBitmapFont(missingGlyphChar?: string): BitmapFont | null;
            destroy(): void;
            destroyed(): boolean;
    }
}

declare module 'g/lib/EventIndex' {
    /**
      * @akashic/playlog の各 interface に名前を与える const enum 群。
      *
      * playlog.Tick や playlog.Event は、実態としてはただのヘテロ配列である。
      * 各 interface にはインデックスと型名のみがあり、それぞれの値の意味内容は自然言語でしか記述されていない。
      * インデックスのハードコーディングを避けるため、ここで const enum で名前を与えることにする。
      *
      * 本当はこのファイルの内容は playlog に移管すべきだが、
      * playlog に存在しない `Local` フィールドを使うため akashic-engine 側で扱う。
      *
      */
    export namespace EventIndex {
        const enum Tick {
            Age = 0,
            Events = 1,
            StorageData = 2
        }
        const enum TickList {
            From = 0,
            To = 1,
            TicksWithEvents = 2
        }
        const enum General {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2
        }
        const enum Join {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            PlayerName = 3,
            StorageData = 4,// TODO: 削除
            Local = 5
        }
        const enum Leave {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            Local = 3
        }
        const enum Timestamp {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            Timestamp = 3,
            Local = 4
        }
        const enum PlayerInfo {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            PlayerName = 3,
            UserData = 4,
            Local = 5
        }
        const enum Message {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            Message = 3,
            Local = 4
        }
        const enum PointDown {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            PointerId = 3,
            X = 4,
            Y = 5,
            EntityId = 6,
            Button = 7,
            Local = 8
        }
        const enum PointMove {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            PointerId = 3,
            X = 4,
            Y = 5,
            StartDeltaX = 6,
            StartDeltaY = 7,
            PrevDeltaX = 8,
            PrevDeltaY = 9,
            EntityId = 10,
            Button = 11,
            Local = 12
        }
        const enum PointUp {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            PointerId = 3,
            X = 4,
            Y = 5,
            StartDeltaX = 6,
            StartDeltaY = 7,
            PrevDeltaX = 8,
            PrevDeltaY = 9,
            EntityId = 10,
            Button = 11,
            Local = 12
        }
        const enum Operation {
            Code = 0,
            EventFlags = 1,
            PlayerId = 2,
            OperationCode = 3,
            OperationData = 4,
            Local = 5
        }
    }
}

declare module 'g/lib/EventPriority' {
    export const enum EventPriority {
        Lowest = 0,
        Unjoined = 1,
        Joined = 2,
        System = 3
    }
}

declare module 'g/lib/ExceptionFactory' {
    import type { AssertionError, AssetLoadError, TypeMismatchError } from "@akashic/pdi-types";
    import type { RequestAssetDetail, RequestAssetLoadError } from "g/lib/errors";
    /**
      * 例外生成ファクトリ。
      * エンジン内部での例外生成に利用するもので、ゲーム開発者は通常本モジュールを利用する必要はない。
      */
    export namespace ExceptionFactory {
        function createAssertionError(message: string, cause?: any): AssertionError;
        function createTypeMismatchError(methodName: string, expected: any, actual?: any, cause?: any): TypeMismatchError;
        function createAssetLoadError(message: string, retriable?: boolean, _type?: unknown, // 歴史的経緯により残っている値。利用していない。
        cause?: any): AssetLoadError;
        function createRequestAssetLoadError(message: string, detail: RequestAssetDetail, cause?: any): RequestAssetLoadError;
    }
}

declare module 'g/lib/Font' {
    import type { Glyph } from "@akashic/pdi-types";
    import type { TextMetrics } from "g/lib/TextMetrics";
    /**
        * フォント。
        */
    export abstract class Font {
            /**
                * フォントサイズ。
                *
                * この値は参照のためにのみ公開されている。ゲーム開発者はこの値を変更すべきではない。
                */
            size: number;
            /**
                * グリフの取得。
                *
                * 取得に失敗するとnullが返る。
                *
                * @param code 文字コード
                */
            abstract glyphForCharacter(code: number): Glyph | null;
            abstract destroy(): void;
            abstract destroyed(): boolean;
            /**
                * 対象の文字列を一行で描画した際の計測情報を返す。
                *
                * @param text 文字列
                */
            measureText(text: string): TextMetrics;
    }
}

declare module 'g/lib/InternalOperationPluginInfo' {
    import type { OperationPluginInfo } from "@akashic/game-configuration";
    import type { OperationPlugin } from "g/lib/OperationPlugin";
    /**
        * エンジン内部で用いる、操作プラグインの管理情報
        * 本インターフェースをゲーム開発者が利用する必要はない。
        * @deprecated 利用しないでください。
        */
    export interface InternalOperationPluginInfo extends OperationPluginInfo {
            /**
                * サポートされていない環境など、操作プラグインを初期化できなかった場合 `undefined` 。
                * @private
                */
            _plugin?: OperationPlugin;
    }
}

declare module 'g/lib/NinePatchSurfaceEffector' {
    import type { CommonRect, Surface } from "@akashic/pdi-types";
    import type { Game } from "g/lib/Game";
    import type { SurfaceEffector } from "g/lib/SurfaceEffector";
    /**
        * ナインパッチによる描画処理を提供するSurfaceEffector。
        *
        * このSurfaceEffectorは、画像素材の拡大・縮小において「枠」の表現を実現するものである。
        * 画像の上下左右の「枠」部分の幅・高さを渡すことで、上下の「枠」を縦に引き延ばすことなく、
        * また左右の「枠」を横に引き延ばすことなく画像を任意サイズに拡大・縮小できる。
        * ゲームにおけるメッセージウィンドウやダイアログの表現に利用することを想定している。
        *
        * @deprecated 非推奨である。将来的に削除される。代わりに `SurfaceUtil#drawNinePatch()` を利用すること。
        */
    export class NinePatchSurfaceEffector implements SurfaceEffector {
            game: Game;
            borderWidth: CommonRect;
            /**
                * @private
                */
            _surface: Surface | undefined;
            /**
                * @private
                */
            _beforeSrcSurface: Surface | undefined;
            /**
                * `NinePatchSurfaceEffector` のインスタンスを生成する。
                * @deprecated 非推奨である。将来的に削除される。代わりに `SurfaceUtil#drawNinePatch()` を利用すること。
                * @param game このインスタンスが属する `Game`。
                * @param borderWidth 上下左右の「拡大しない」領域の大きさ。すべて同じ値なら数値一つを渡すことができる。省略された場合、 `4`
                */
            constructor(game: Game, borderWidth?: CommonRect | number);
            /**
                * 指定の大きさに拡大・縮小した描画結果の `Surface` を生成して返す。詳細は `SurfaceEffector#render` の項を参照。
                */
            render(srcSurface: Surface, width: number, height: number): Surface;
    }
}

declare module 'g/lib/Require' {
    export interface Require {
        (path: string): any;
        resolve(path: string): string;
    }
}

declare module 'g/lib/RequireCachedValue' {
    import type { RequireCacheable } from "g/lib/RequireCacheable";
    export class RequireCachedValue implements RequireCacheable {
            /**
                * @ignore
                */
            _value: any;
            constructor(value: any);
            /**
                * @private
                */
            _cachedValue(): any;
    }
}

declare module 'g/lib/ScriptAssetContext' {
    import type { ScriptAsset } from "@akashic/pdi-types";
    import type { Module } from "g/lib/Module";
    import type { RequireCacheable } from "g/lib/RequireCacheable";
    /**
        * `ScriptAsset` の実行コンテキスト。
        * 通常スクリプトアセットを実行するためにはこのクラスを経由する。
        *
        * ゲーム開発者がこのクラスを利用する必要はない。
        * スクリプトアセットを実行する場合は、暗黙にこのクラスを利用する `require()` を用いること。
        */
    export class ScriptAssetContext implements RequireCacheable {
            /**
                * @private
                */
            _asset: ScriptAsset;
            /**
                * @private
                */
            _module: Module;
            /**
                * @private
                */
            _started: boolean;
            constructor(asset: ScriptAsset, module: Module);
            /**
                * @private
                */
            _cachedValue(): any;
            /**
                * @private
                */
            _executeScript(currentModule?: Module): any;
    }
}

declare module 'g/lib/SpriteFactory' {
    import type { Camera } from "g/lib/Camera";
    import type { E } from "g/lib/entities/E";
    import { Sprite } from "g/lib/entities/Sprite";
    import type { Scene } from "g/lib/Scene";
    export class SpriteFactory {
            /**
                * e の描画内容を持つ Sprite を生成する。
                * @param scene 作成したSpriteを登録するScene
                * @param e Sprite化したいE
                * @param camera 使用カメラ
                */
            static createSpriteFromE(scene: Scene, e: E, camera?: Camera): Sprite;
            /**
                * scene の描画内容を持つ Sprite を生成する。
                * @param toScene 作ったSpriteを登録するScene
                * @param fromScene Sprite化したいScene
                * @param camera 使用カメラ
                */
            static createSpriteFromScene(toScene: Scene, fromScene: Scene, camera?: Camera): Sprite;
    }
}

declare module 'g/lib/SurfaceAtlasSlot' {
    /**
      * SurfaceAtlasの空き領域管理クラス。
      *
      * 本クラスのインスタンスをゲーム開発者が直接生成することはなく、ゲーム開発者が利用する必要もない。
      */
    export class SurfaceAtlasSlot {
        x: number;
        y: number;
        width: number;
        height: number;
        prev: SurfaceAtlasSlot | null;
        next: SurfaceAtlasSlot | null;
        constructor(x: number, y: number, width: number, height: number);
    }
}

declare module 'g/lib/SurfaceEffector' {
    import type { Surface } from "@akashic/pdi-types";
    /**
        * `Surface` に対して様々な表現によって書き込む事が出来ることを表すインターフェース。
        *
        * `Surface` を受け取る一部のクラスは、同時に `SurfaceEffector` を受け取り、
        * `Surface` の描画方法をカスタマイズできるようになっている。(現在は `Pane` のみ)
        * ゲーム開発者は、そのようなクラスに対して `SurfaceEffector` のインスタンスを生成して渡すことができる。
        * 通常、 `SurfaceEffector` の個別のメソッドをゲーム開発者が呼び出す必要はない。
        *
        * @deprecated 非推奨である。将来的に削除される。
        */
    export interface SurfaceEffector {
            /**
                * 指定の大きさに拡大・縮小した描画結果の `Surface` を生成して返す。
                *
                * 通常、このメソッドはエンジンによって暗黙に呼び出される。ゲーム開発者が明示的に呼び出す必要はない。
                * @param srcSurface 拡大・縮小して描画する `Surface`
                * @param width 描画する幅
                * @param height 描画する高さ
                */
            render(srcSurface: Surface, width: number, height: number): Surface;
    }
}

declare module 'g/lib/SurfaceUtil' {
    import type { CommonRect, ImageAsset, Renderer, Surface } from "@akashic/pdi-types";
    /**
        * Surface に関連するユーティリティ。
        */
    export namespace SurfaceUtil {
            /**
                * 引数 `src` が `undefined` または `Surface` でそのまま返す。
                * そうでなくかつ `ImageAsset` であれば `Surface` に変換して返す。
                *
                * @param src
                */
            function asSurface(src: ImageAsset | Surface | undefined): Surface | undefined;
            type AnimatingHandler = {
                    /**
                        * @private
                        */
                    _handleAnimationStart: () => void;
                    /**
                        * @private
                        */
                    _handleAnimationStop: () => void;
            };
            /**
                * サーフェスのアニメーティングイベントへのハンドラ登録。
                *
                * これはエンジンが利用するものであり、ゲーム開発者が呼び出す必要はない。
                *
                * @param animatingHandler アニメーティングハンドラ
                * @param surface サーフェス
                */
            function setupAnimatingHandler(animatingHandler: AnimatingHandler, surface: Surface): void;
            /**
                * アニメーティングハンドラを別のサーフェスへ移動する。
                *
                * これはエンジンが利用するものであり、ゲーム開発者が呼び出す必要はない。
                *
                * @param animatingHandler アニメーティングハンドラ
                * @param _beforeSurface ハンドラ登録を解除するサーフェス
                * @param afterSurface ハンドラを登録するサーフェス
                */
            function migrateAnimatingHandler(animatingHandler: AnimatingHandler, _beforeSurface: Surface, afterSurface: Surface): void;
            /**
                * 対象の `Surface` にナインパッチ処理された `Surface` を描画する。
                *
                * これは、画像素材の拡大・縮小において「枠」の表現を実現するものである。
                * 画像の上下左右の「枠」部分の幅・高さを渡すことで、上下の「枠」を縦に引き延ばすことなく、
                * また左右の「枠」を横に引き延ばすことなく画像を任意サイズに拡大・縮小できる。
                * ゲームにおけるメッセージウィンドウやダイアログの表現に利用することを想定している。
                *
                * @param destSurface 描画先 `Surface`
                * @param srcSurface 描画元 `Surface`
                * @param borderWidth 上下左右の「拡大しない」領域の大きさ。すべて同じ値なら数値一つを渡すことができる。省略された場合、 `4`
                */
            function drawNinePatch(destSurface: Surface, srcSurface: Surface, borderWidth?: CommonRect | number): void;
            /**
                * 対象の `Renderer` にナインパッチ処理された `Surface` を描画する。
                *
                * 開発者は以下のような状況でこの関数を利用すべきである。
                * * E を継承した独自の Entity を renderSelf() メソッドで描画する場合。この場合描画先の Surface が不明なので drawNinePatch() よりもこの関数の方が適している。
                * * Surface全体ではなく部分的に描画したい場合。drawNinePatch() では Surface 全体の描画にしか対応していないため。
                *
                * @param renderer 描画先 `Renderer`
                * @param width 描画先の横幅
                * @param height 描画先の縦幅
                * @param surface 描画元 `Surface`
                * @param borderWidth 上下左右の「拡大しない」領域の大きさ。すべて同じ値なら数値一つを渡すことができる。省略された場合、 `4`
                */
            function renderNinePatch(renderer: Renderer, width: number, height: number, surface: Surface, borderWidth?: CommonRect | number): void;
    }
}

declare module 'g/lib/TextAlign' {
    /**
        * テキストの描画位置。
        * @deprecated 非推奨である。将来的に削除される。代わりに `TextAlignString` を利用すること。
        */
    export enum TextAlign {
            /**
                * 左寄せ。
                */
            Left = 0,
            /**
                * 中央寄せ。
                */
            Center = 1,
            /**
                * 右寄せ。
                */
            Right = 2
    }
}

declare module 'g/lib/TextAlignString' {
    /**
      * テキストの描画位置。
      *
      * - `"left"`: 左寄せ。
      * - `"center"`: 中央寄せ。
      * - `"right"`: 右寄せ。
      */
    export type TextAlignString = "left" | "center" | "right";
}

declare module 'g/lib/TextMetrics' {
    /**
        * テキストの計測情報。
        */
    export interface TextMetrics {
            width: number;
            actualBoundingBoxLeft: number;
            actualBoundingBoxRight: number;
    }
    /**
        * テキストの計測情報。
        * @deprecated 非推奨である。将来的に削除される。代わりに `TextMetrics` を利用すること。
        */
    export interface TextMetrix extends TextMetrics {
    }
}

declare module 'g/lib/Util' {
    import type { CommonArea, CommonOffset, CompositeOperationString } from "@akashic/pdi-types";
    import { CompositeOperation as CompOp } from "@akashic/pdi-types";
    /**
        * ユーティリティ。
        */
    export namespace Util {
            /**
                * 2点間(P1..P2)の距離(pixel)を返す。
                * @param {number} p1x P1-X
                * @param {number} p1y P1-Y
                * @param {number} p2x P2-X
                * @param {number} p2y P2-Y
                */
            function distance(p1x: number, p1y: number, p2x: number, p2y: number): number;
            /**
                * 2点間(P1..P2)の距離(pixel)を返す。
                * @param {CommonOffset} p1 座標1
                * @param {CommonOffset} p2 座標2
                */
            function distanceBetweenOffsets(p1: CommonOffset, p2: CommonOffset): number;
            /**
                * 2つの矩形の中心座標(P1..P2)間の距離(pixel)を返す。
                * @param {CommonArea} p1 矩形1
                * @param {CommonArea} p2 矩形2
                */
            function distanceBetweenAreas(p1: CommonArea, p2: CommonArea): number;
            /**
                * idx文字目の文字のchar codeを返す。
                *
                * これはString#charCodeAt()と次の点で異なる。
                * - idx文字目が上位サロゲートの時これを16bit左シフトし、idx+1文字目の下位サロゲートと論理和をとった値を返す。
                * - idx文字目が下位サロゲートの時nullを返す。
                *
                * @param str 文字を取り出される文字列
                * @param idx 取り出される文字の位置
                */
            function charCodeAt(str: string, idx: number): number | null;
            /**
                * enum の値の文字列を snake-case に変換した文字列を返す。
                * @deprecated 非推奨である。非推奨の機能との互換性確保のために存在する。ゲーム開発者が使用すべきではない。
                */
            function enumToSnakeCase<T extends number, U extends string>(enumDef: {
                    [key: number]: string;
            }, val: T): U;
            /**
                * 数値を範囲内［min, max］に丸める
                * @param num 丸める値
                * @param min 値の下限
                * @param max 値の上限
                */
            function clamp(num: number, min: number, max: number): number;
            /**
                * CompositeOperation を CompositeOperationString に読み替えるテーブル。
                * @deprecated 非推奨である。非推奨の機能との互換性のために存在する。ゲーム開発者が使用すべきではない。
                */
            const compositeOperationStringTable: {
                    [K in CompOp]: CompositeOperationString;
            };
    }
}

declare module 'g/lib/Xorshift' {
    export class Xorshift {
            static deserialize(ser: XorshiftSerialization): Xorshift;
            constructor(seed: number | [number, number, number, number]);
            initState(seed: number): void;
            randomInt(): [number, number];
            random(): number;
            nextInt(min: number, sup: number): number;
            serialize(): XorshiftSerialization;
    }
    /**
        * serialize/deserialize用のインターフェース
        */
    export interface XorshiftSerialization {
            /**
                * @ignore
                */
            _state0U: number;
            /**
                * @ignore
                */
            _state0L: number;
            /**
                * @ignore
                */
            _state1U: number;
            /**
                * @ignore
                */
            _state1L: number;
    }
}

declare module 'g/lib/XorshiftRandomGenerator' {
    import { RandomGenerator } from "g/lib/RandomGenerator";
    import type { XorshiftSerialization } from "g/lib/Xorshift";
    /**
        * Xorshiftを用いた乱数生成期。
        */
    export class XorshiftRandomGenerator extends RandomGenerator {
            static deserialize(ser: XorshiftRandomGeneratorSerialization): XorshiftRandomGenerator;
            constructor(seed: number, xorshift?: XorshiftSerialization);
            /**
                * 乱数を生成する。
                * `min` 以上 `max` 以下の数値を返す。
                *
                * @deprecated 非推奨である。将来的に削除される。代わりに `XorshiftRandomGenerator#generate()` を利用すること。
                */
            get(min: number, max: number): number;
            /**
                * 乱数を生成する。
                * 0 以上 1 未満の数値を返す。
                *
                * ローカルイベントの処理中を除き、原則 `Math.random()` ではなくこのメソッドを利用すること。
                */
            generate(): number;
            serialize(): XorshiftRandomGeneratorSerialization;
    }
    /**
        * serialize/deserialize用のインターフェース
        */
    export interface XorshiftRandomGeneratorSerialization {
            /**
                * @private
                */
            _seed: number;
            /**
                * @private
                */
            _xorshift: XorshiftSerialization;
    }
}

