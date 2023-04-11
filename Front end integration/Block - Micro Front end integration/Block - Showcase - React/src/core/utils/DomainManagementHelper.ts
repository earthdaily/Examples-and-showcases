import G6HttpClient from '@core/http-clients/G6HttpClient';

export interface CustomQueryString {
    name: string;
    value: any;
}

export const get = <T>(
    baseUrl: string,
    fileName: string,
    limit?: string,
    fields?: string[],
    //columnGroups?: string[],
    extraQueryString?: CustomQueryString[],
) => {
    return G6HttpClient.get<T>(`${baseUrl}/${fileName}`, getOptions(limit, fields, extraQueryString));
};

const getOptions = (
    limit?: string,
    fields?: string[],
    //rowGroups?: string[],
    //pageGroups?: string[],
    //columnGroups?: string[],
    //sort?: string[],
    //filter?: string[],
    extraQueryString?: CustomQueryString[],
) => {
    const params = new URLSearchParams();
    if (limit != null) params.append('$limit', limit);
    //if (sort != null) params.append('$sort', limit);
    //if (filter != null) params.append('$filter', limit);
    if (fields != null) params.append('$fields', paramsReducer(fields));

    if (extraQueryString != null) {
        extraQueryString.map((pair: CustomQueryString) => {
            params.append(pair.name, pair.value);
        });
    }
    //if (columnGroups != null) params.append('$column-groups', paramsReducer(rowGroups));
    //if (rowGroups != null) params.append('$row-groups', paramsReducer(rowGroups));
    //if (pageGroups != null) params.append('$page-groups', paramsReducer(rowGroups));
    //if (extraQueryString != null) params.append('$page-groups', paramsReducer(rowGroups));

    return { params };
};

const paramsReducer = (params: string[]) => {
    return params.reduce((acc: string, curr: string) => `${acc},${curr}`);
};
