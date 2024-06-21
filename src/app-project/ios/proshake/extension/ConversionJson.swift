//
//  ConversionJson.swift
//  Machi
//
//  Created by Jianzhi.wang on 2022/10/13.
//

import Foundation
class ConversionJson: NSObject {
    static let shared = ConversionJson()
    
    // 解析拿到的 json 轉成 Dictionary 的格式，若沒有回傳 nil
    func JsonToDictionary(data: Data) ->  Dictionary<String,AnyObject>? {
        do {
            //create json object from data
            if let json = try JSONSerialization.jsonObject(with: data, options: .mutableContainers) as? [String: AnyObject] {
                // print(json)
                return json
            }
        } catch let error {
            print("JSON to Dictionary error: \(error.localizedDescription)")
        }
        return nil
    } // end func JSONtoDictionary
    
    // 解析拿到的 Dictionary 轉成 JSON 格式
    func DictionaryToJson(parameters: Dictionary<String,Any>) -> String? {
        do {
            return  try String(data:JSONSerialization.data(withJSONObject: parameters,options: .prettyPrinted), encoding: .utf8)
        } catch let error {
            print("Dictionary to JSON error: \(error.localizedDescription)")
            return nil
        }
    }
    //
    func ArrayToJson(parameters: Array<Any>) -> String? {
        do {
            return  try String(data:JSONSerialization.data(withJSONObject: parameters,options: .prettyPrinted), encoding: .utf8)
        } catch let error {
            print("Dictionary to JSON error: \(error.localizedDescription)")
            return nil
        }
    }
    
    // 檢查 json 是否為 "<null>"
    func nullToNil(value: AnyObject?) -> AnyObject? {
        if value is NSNull {    return nil } else { return value }
    }
}


extension StringProtocol {
    func index<S: StringProtocol>(of string: S, options: String.CompareOptions = []) -> Index? {
        range(of: string, options: options)?.lowerBound
    }
    func endIndex<S: StringProtocol>(of string: S, options: String.CompareOptions = []) -> Index? {
        range(of: string, options: options)?.upperBound
    }
    func indices<S: StringProtocol>(of string: S, options: String.CompareOptions = []) -> [Index] {
        ranges(of: string, options: options).map(\.lowerBound)
    }
    func ranges<S: StringProtocol>(of string: S, options: String.CompareOptions = []) -> [Range<Index>] {
        var result: [Range<Index>] = []
        var startIndex = self.startIndex
        while startIndex < endIndex,
            let range = self[startIndex...]
                .range(of: string, options: options) {
                result.append(range)
                startIndex = range.lowerBound < range.upperBound ? range.upperBound :
                    index(range.lowerBound, offsetBy: 1, limitedBy: endIndex) ?? endIndex
        }
        return result
    }
}
extension String {
    subscript (i: Int) -> Character {
        return self[index(startIndex, offsetBy: i)]
    }
    
    subscript (bounds: CountableRange<Int>) -> Substring {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(startIndex, offsetBy: bounds.upperBound)
        if end < start { return "" }
        return self[start..<end]
    }
    
    subscript (bounds: CountableClosedRange<Int>) -> Substring {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(startIndex, offsetBy: bounds.upperBound)
        if end < start { return "" }
        return self[start...end]
    }
    
    subscript (bounds: CountablePartialRangeFrom<Int>) -> Substring {
        let start = index(startIndex, offsetBy: bounds.lowerBound)
        let end = index(endIndex, offsetBy: -1)
        if end < start { return "" }
        return self[start...end]
    }
    
    subscript (bounds: PartialRangeThrough<Int>) -> Substring {
        let end = index(startIndex, offsetBy: bounds.upperBound)
        if end < startIndex { return "" }
        return self[startIndex...end]
    }
    
    subscript (bounds: PartialRangeUpTo<Int>) -> Substring {
        let end = index(startIndex, offsetBy: bounds.upperBound)
        if end < startIndex { return "" }
        return self[startIndex..<end]
    }
}

extension StringProtocol {
    func distance(of element: Element) -> Int? { firstIndex(of: element)?.distance(in: self) }
    func distance<S: StringProtocol>(of string: S) -> Int? { range(of: string)?.lowerBound.distance(in: self) }
}
extension Collection {
    func distance(to index: Index) -> Int { distance(from: startIndex, to: index) }
}
extension String.Index {
    func distance<S: StringProtocol>(in string: S) -> Int { string.distance(to: self) }
}
